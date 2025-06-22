from rest_framework import serializers
from .models import ServiceType, ServiceRequest, Update, Building
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
import mimetypes

class UserSerializer(serializers.ModelSerializer):
    # write-only password fields for user creation or update
    password = serializers.CharField(write_only=True, required=False, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=False)

    # list of building ids for assigning buildings to the user, write-only
    building_ids = serializers.ListField(child=serializers.IntegerField(), write_only=True, required=False)

    # method field to serialize the buildings associated with the user
    buildings = serializers.SerializerMethodField()

    # method field to determine if the user is an admin or regular user
    user_type = serializers.SerializerMethodField()

    class Meta:
        model = User
        # the fields included in the serializer
        fields = ['id', 'username', 'email', 'password', 'password2', 'first_name', 'last_name', 'building_ids', 'buildings', 'user_type']
        # extra settings for optional fields
        extra_kwargs = {'first_name': {'required': False}, 'last_name': {'required': False}}

    def get_buildings(self, obj):
        # serialize the associated buildings as a list of dictionaries
        return [{"id": building.id, "name": building.name, 'address_line1': building.address_line1, 'address_line2': building.address_line2, 'city': building.city, 'postcode': building.postcode, 'latitude': building.latitude, 'longitude': building.longitude} for building in obj.buildings.all()]

    def get_user_type(self, obj):
        # determine the user type based on the is_superuser field
        return 'admin' if obj.is_superuser else 'regular'

    def validate(self, data):
        # during creation, ensure both passwords are provided and match
        if self.instance is None:
            if not data.get('password') or not data.get('password2'):
                raise serializers.ValidationError({"password": "Both password fields are required."})
            if data['password'] != data['password2']:
                raise serializers.ValidationError({"password2": "Password fields didn't match."})

            # check if the username or email is already taken
            if User.objects.filter(username=data['username']).exists():
                raise serializers.ValidationError({"username": "Username is already taken."})
            if User.objects.filter(email=data['email']).exists():
                raise serializers.ValidationError({"email": "Email is already taken."})

        # during update, ensure the email is not taken by another user
        if self.instance:
            email = data.get('email', self.instance.email)
            if User.objects.filter(email=email).exclude(pk=self.instance.pk).exists():
                raise serializers.ValidationError({"email": "A user with that email already exists."})

        # check if the provided building ids exist
        building_ids = data.get('building_ids')
        if building_ids and not Building.objects.filter(id__in=building_ids).exists():
            raise serializers.ValidationError({"building_ids": "One or more buildings do not exist."})

        return data

    def create(self, validated_data):
        # remove password2 as it's not needed for user creation
        validated_data.pop('password2', None)
        building_ids = validated_data.pop('building_ids', [])
        # create the user with the provided data
        user = User.objects.create_user(**validated_data)
        # associate the buildings if provided
        if building_ids:
            buildings = Building.objects.filter(id__in=building_ids)
            user.buildings.set(buildings)
        return user

    def update(self, instance, validated_data):
        building_ids = validated_data.pop('building_ids', None)
        password = validated_data.pop('password', None)

        # update the instance with the validated data
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        # update the password if provided
        if password:
            instance.set_password(password)

        # update the associated buildings if provided
        if building_ids is not None:
            buildings = Building.objects.filter(id__in=building_ids)
            instance.buildings.set(buildings)

        # save the updated instance
        instance.save()
        return instance

class UserSimpleSerializer(serializers.ModelSerializer):
    # the UserSerializer is primarily used for Auth 
    # this is a simplified version to be used when representing user data 
    # may seem like duplicate code but it avoids the overhead of serializing all users fields and focuses on only the information
    # required for the frontend e.g email first_name etc 
   
    # SerializerMethodField to determine if the user is an admin or regular user
    user_type = serializers.SerializerMethodField()

    class Meta:
        model = User
        # only the required fields for frontend
        fields = ['id', 'first_name', 'last_name', 'email', 'user_type']

    def get_user_type(self, obj):
        # logic required from frontend for Role Based Access - very important
        return 'admin' if obj.is_superuser else 'regular'


class UpdatePasswordSerializer(serializers.Serializer):
    # logic for this could be within the view itself but seems more appropriate to put here
    current_password = serializers.CharField(required=True)
    new_password1 = serializers.CharField(required=True, validators=[validate_password])
    new_password2 = serializers.CharField(required=True)

    # check passwords match
    def validate(self, data):
        if data['new_password1'] != data['new_password2']:
            raise serializers.ValidationError({"new_password2": "The two passwords do not match."})
        return data

    # check current password passed is valid
    def validate_current_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError({"current_password": "Current password is incorrect."})
        return value
    
    # no need to validate the regex/requirements - django should handle

class BuildingSerializer(serializers.ModelSerializer):
    # nested Serializer for assigned users
    users = UserSimpleSerializer(many=True, read_only=True)

    class Meta:
        model = Building
        fields = [
            'id', 'name', 'address_line1', 'address_line2', 'city', 
            'postcode', 'country', 'latitude', 'longitude', 'users'
        ]

    # validate latitude ensure with valid range
    def validate_latitude(self, value):
        if value < -90 or value > 90:
            raise serializers.ValidationError("Latitude must be between -90 and 90 degrees.")
        return value

    # validate longitude ensure with valid range
    def validate_longitude(self, value):
        if value < -180 or value > 180:
            raise serializers.ValidationError("Longitude must be between -180 and 180 degrees.")
        return value


class ServiceTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceType
        fields = ['id', 'name', 'description', 'service_icon', 'is_active']

    def validate_service_icon(self, value):
        # validate icon size and throw error if too big
        if value.size > 1024 * 1024 * 5:  # 5MB max size
            raise serializers.ValidationError("Image file size should not exceed 5MB.")

        # validate icon mime type - only jpeg, png and gif allow (could add more later if needed just add to List)
        allowed_types = ['image/jpeg', 'image/png', 'image/gif']
        file_type = mimetypes.guess_type(value.name)[0]

        # throw error if invalid type
        if file_type not in allowed_types:
            raise serializers.ValidationError(f"Unsupported file type: {file_type}. Only JPEG, PNG, and GIF are allowed.")
        
        return value
    
    def to_representation(self, instance):
        # quite an annoying issue - not sure if middleware is causing it but when path is concat with media URL it contains
        # %A0 which is a line break so frontend media URL was always broken - fixed here but probably should invesitgate further 

        representation = super().to_representation(instance)
        # check path
        if hasattr(instance, 'service_icon') and instance.service_icon:
            # get url of icon
            service_icon_url = instance.service_icon.url
            # clean url (removing the line break)
            clean_url = service_icon_url.replace('\n', '').replace('\r', '').strip()
            # set the URL for frontend
            if clean_url.startswith('https://https://'):
                clean_url = clean_url.replace('https://https://', 'https://', 1)

            representation['service_icon'] = clean_url
        return representation
    
    
class ServiceRequestSerializer(serializers.ModelSerializer):
    # used when creating - only id needs to be passed rather than whole obj
    service_request_item = serializers.PrimaryKeyRelatedField(
        queryset=ServiceType.objects.all(),
        write_only=True
    )
    # used for retrieving 
    service_request_item_detail = ServiceTypeSerializer(
        source='service_request_item', 
        read_only=True
    )
    building = serializers.PrimaryKeyRelatedField(
        queryset=Building.objects.all(),
        write_only=True
    )
    building_detail = BuildingSerializer(
        source='building', 
        read_only=True
    )
    created_by = UserSimpleSerializer(read_only=True)

    class Meta:
        model = ServiceRequest
        fields = [
            'id',
            'customer_notes',
            'status',
            'priority',
            'created_date',
            'updated_date',
            'created_by',
            'service_request_item',
            'service_request_item_detail',
            'building',
            'building_detail',
            'service_level_agreement_date'
        ]
        # shouldn't change
        read_only_fields = [
            'id', 
            'created_date', 
            'updated_date', 
            'service_level_agreement_date'
        ]

    # ensure Service is still active at time of creation
    def validate_service_request_item(self, value):
        if not value.is_active:
            raise serializers.ValidationError("The selected Service is no longer available.")
        return value

    # ensure Building still exists or is passed (admin can remove building)
    def validate_building(self, value):
        if value is None:
            raise serializers.ValidationError("Building must be specified.")
        return value

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['created_by'] = user
        return super().create(validated_data)



class UpdateSerializer(serializers.ModelSerializer):
    created_by = UserSimpleSerializer(read_only=True)

    # allow null associated to - when Customer creates Update don't want it to be assigned to any specific Admin
    associated_to = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), allow_null=True, required=False)

    # no further validation needed here - Model should handle nulls
    class Meta:
        model = Update
        fields = ['id', 'title', 'message', 'created_date', 'created_by', 'associated_to', 'service_request', 'type', 'is_read']
        read_only_fields = ['id', 'created_date']