from django.contrib import admin
from .models import ServiceType, ServiceRequest, Update, Building, ErrorLog


@admin.register(ServiceType)
class ServiceTypeAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'service_icon', 'is_active')
    search_fields = ('name', 'description')
    list_filter = ('is_active',)

@admin.register(ServiceRequest)
class ServiceRequestAdmin(admin.ModelAdmin):
    list_display = ('status', 'created_date', 'updated_date', 'created_by', 'service_request_item')
    search_fields = ('customer_notes', 'status')
    list_filter = ('status', 'created_date', 'updated_date')
    raw_id_fields = ('created_by', 'service_request_item')

@admin.register(Update)
class UpdateAdmin(admin.ModelAdmin):
    list_display = ('service_request', 'message', 'created_date', 'created_by', 'is_read')
    search_fields = ('service_request__title', 'message', 'created_by__username')
    list_filter = ('is_read', 'created_date')

@admin.register(Building)
class BuildingAdmin(admin.ModelAdmin):
    list_display = ('name', 'address_line1', 'address_line2', 'city', 'postcode', 'country', 'latitude', 'longitude')
    search_fields = ('name', 'address_line1', 'address_line2', 'city', 'postcode', 'country')
    list_filter = ('city', 'country')

@admin.register(ErrorLog)
class ErrorLogAdmin(admin.ModelAdmin):
    list_display = ('timestamp', 'endpoint', 'error_message')
    search_fields = ('endpoint', 'error_message')
    list_filter = ('timestamp',)
