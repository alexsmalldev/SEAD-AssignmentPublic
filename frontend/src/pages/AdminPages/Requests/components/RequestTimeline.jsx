// External libraries
import { useState, useEffect } from 'react'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import moment from 'moment'

// Internal
import api from '../../../../api/apiConfig'
import { useNotification } from '../../../../contexts/NotificationContext'
import { useUser } from '../../../../contexts/UserContext'
import { useLoading } from '../../../../contexts/LoadingContext'

import { cn } from '../../../../lib/utils'

const RequestTimeline = ({ requestDetails, requestUpdates, handleSubmit, requestStatus }) => {
  const { user, hasRole } = useUser();
  const [comment, setComment] = useState('')
  const [updates, setUpdates] = useState([])
  const { triggerNotification } = useNotification();

  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    setUpdates(requestUpdates);
  }, [requestUpdates]);

  const onSubmit = async (e) => {
    e.preventDefault()

    if (!comment.trim()) {
      return
    }

    showLoading('Adding Comment...');

    try {
      const response = await api.post(`/updates/`, {
        service_request: requestDetails?.id,
        message: comment,
        type: 'message'
      });

      setUpdates((prevUpdates) => [...prevUpdates, response.data])
      setComment('')
    } catch (error) {
      triggerNotification('FAIL', 'Error adding request comment', `${error.message}`)
    } finally {
      hideLoading();
    }

  }

  return (
    <>
      <ul role="list" className="space-y-6">
        {updates.map((update, index) => (
          <li key={update.id} className="relative flex gap-x-4">
            <div
              className={cn(
                index === updates.length - 1 ? 'h-6' : '-bottom-6',
                'absolute left-0 top-0 flex w-6 justify-center',
              )}
            >
              <div className="w-px bg-gray-200" />
            </div>
            {update.type === 'event' ? (
              <>
                <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-white">
                  {update.message.includes('Completed') ? (
                    <CheckCircleIcon aria-hidden="true" className="h-6 w-6 text-indigo-600" />
                  ) : (
                    <div className="h-1.5 w-1.5 rounded-full bg-gray-100 ring-1 ring-gray-300" />
                  )}
                </div>
                <div className="flex flex-row justify-start gap-2">
                  <p className="flex-auto py-0.5 text-sm leading-5 text-gray-500">
                    <span className="font-medium text-gray-900">{update.message}</span>
                  </p>
                  <time dateTime={update.created_date} className="flex-none py-0.5 text-xs leading-5 text-gray-500">
                    {moment(update.created_date).fromNow()}
                  </time>
                </div>

              </>
            ) : (
              <>
                <div className="w-8 h-8 rounded-full bg-gray-600 z-50 text-xs text-white font-semibold flex items-center justify-center">
                  {update.created_by?.first_name[0]?.toUpperCase() + update.created_by?.last_name[0]?.toUpperCase()}
                </div>
                <div className={
                  cn(
                    update.created_by.id == user.id ?
                      'bg-indigo-500 text-white' :
                      'ring-1 ring-inset ring-gray-200 text-gray-500',
                    "flex-2 rounded-md p-3"
                  )
                }>
                  <div className="flex justify-between gap-x-4">
                    <div className="py-0.5 text-xs leading-5">
                      <span className={
                        update.created_by.id == user.id ?
                          'font-medium text-white' : 
                          'font-medium text-gray-900' 
                      }>
                        {update.created_by.first_name + ' ' + update.created_by.last_name}
                      </span>
                    </div>
                    <time dateTime={update.created_date} className={cn(
                      update.created_by.id == user.id ? 'text-gray-300' : 'text-gray-500',
                      "flex-none py-0.5 text-xs leading-5"
                    )}>
                      {moment(update.created_date).fromNow()}
                    </time>
                  </div>
                  <p className={
                    update.created_by.id == user.id ?
                      'text-sm leading-6 text-white' :
                      'text-sm leading-6 text-gray-500' 
                  }>
                    {update.message || 'No additional message provided'}
                  </p>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      {(requestStatus !== 'completed' && requestStatus !== 'cancelled') ? (
        <div className="mt-6 flex gap-x-3">
          <form onSubmit={onSubmit} className="relative flex-auto">
            <div className="overflow-hidden rounded-lg pb-12 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
              <label htmlFor="comment" className="sr-only">
                Add your comment
              </label>
              <textarea
                id="comment"
                name="comment"
                rows={2}
                placeholder="Enter you comment here..."
                className="block w-full resize-none border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            <div className="absolute inset-x-0 bottom-0 flex justify-end py-2 pl-3 pr-2">
              <button
                type="submit"
                className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Send Comment
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </>
  )
}

export default RequestTimeline;
