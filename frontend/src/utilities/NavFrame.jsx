// External libraries
import React, { useState } from 'react';
import { useLocation, useNavigate, Link, Outlet } from 'react-router-dom';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Popover,
  PopoverButton,
  PopoverPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
} from '@headlessui/react';
import { easeOut, motion } from 'framer-motion';
import {
  Bars3Icon,
  XMarkIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import {
  ClipboardDocumentListIcon,
  Squares2X2Icon,
  BuildingOffice2Icon,
  ClipboardDocumentCheckIcon,
  Cog8ToothIcon,
  BellIcon,
  UserIcon,
  ArrowLeftEndOnRectangleIcon,
  CheckBadgeIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  HomeIcon,
  InformationCircleIcon
} from '@heroicons/react/24/solid';

// Internal
import { useUser } from '../contexts/UserContext';
import { Toaster } from '../components/ui/toaster'
import Notifications from '../pages/SharedPages/Notifications';
import NotificationCount from './NotificationCount';
import { RaiseRequestProvider } from '../contexts/RaiseRequestContext';
import RaiseRequestButton from './RaiseRequestButton';
import { NotificationProvider } from '../contexts/NotificationContext';
import { useAuth } from '../hooks/data/useAuth';
import { cn } from '../lib/utils'


const NavigationFrame = () => {
  const { user, hasRole } = useUser();
  const { logout } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [openNotifications, setOpenNotifications] = useState(false);


  const handleLinkClickMobile = () => {
    if (sidebarOpen) {
      setSidebarOpen(false);
    }
  };

  const handleNotificationsClick = () => {
    if (sidebarOpen) {
      setSidebarOpen(!sidebarOpen);
      setTimeout(() => {
        setOpenNotifications(!openNotifications);
      }, 300);
    } else {
      setOpenNotifications(!openNotifications);
    }
  }


  const adminNavigation = [
    { name: 'Dashboard', href: '/', icon: Squares2X2Icon, current: location.pathname === '/' },
    { name: 'Buildings', href: '/buildings', icon: BuildingOffice2Icon, current: location.pathname.includes('buildings') },
    { name: 'Requests', href: '/requests', icon: ClipboardDocumentCheckIcon, current: location.pathname.includes('requests') },
    {
      name: 'System Administration', icon: Cog8ToothIcon, current: false, defaultOpen: location.pathname === '/manage-users' || location.pathname === '/service-types',
      children: [
        { name: 'Manage Users', href: '/manage-users', current: location.pathname === '/manage-users' },
        { name: 'Services', href: '/service-types', current: location.pathname === '/service-types' },
      ],
    },
    { name: 'Help and FAQ', href: '/help-faqs', icon: InformationCircleIcon, current: location.pathname === '/help-faqs' },

  ];

  const regularNavigation = [
    { name: 'Home', href: '/', icon: HomeIcon, current: location.pathname === '/' },
    { name: 'My Requests', href: '/my-requests', icon: ClipboardDocumentListIcon, current: location.pathname.includes('requests') },
    { name: 'Raise Request', component: <RaiseRequestButton closeMobileSideBar={handleLinkClickMobile} />, icon: ClipboardDocumentCheckIcon, current: location.pathname === '/my-requests/raise' },
    { name: 'Help and FAQ', href: '/help-faq', icon: InformationCircleIcon, current: location.pathname === '/help-faq' },
  ];

  const userNavigation = [
    { name: 'Your profile', href: '/profile', icon: UserIcon, current: location.pathname === '/profile' },
    { name: 'Sign out', icon: ArrowLeftEndOnRectangleIcon, onClick: logout },
  ];

  const navigation = user?.user_type === 'admin' ? adminNavigation : regularNavigation;

  return (
    <>
      <NotificationProvider>
        <RaiseRequestProvider>
          <div className="relative isolate flex min-h-svh w-full bg-white max-lg:flex-col lg:bg-zinc-100" >
            {/* Sidebar for Mobile and Smaller */}
            <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 lg:hidden">
              <DialogBackdrop
                transition
                className="fixed inset-0 bg-black/40 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
              />
              <div className="fixed inset-0 flex p-2">
                <DialogPanel
                  transition
                  className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
                >
                  <TransitionChild>
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
                      <button type="button" onClick={() => setSidebarOpen(false)} className="-m-2.5 p-2.5">
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon aria-hidden="true" className="h-6 w-6 text-white" />
                      </button>
                    </div>
                  </TransitionChild>
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto  px-4 pb-4 rounded-lg bg-white shadow-sm ring-1 ring-zinc-950/5">
                    <div className="flex h-16 shrink-0 items-center mt-auto px-2 border-b border-zinc-950/5">
                      <CheckBadgeIcon aria-hidden="true" className="h-6 w-6 text-indigo-400" />
                      <label className="group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6">FacilityCare</label>

                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-2">
                        {navigation.map((item) => (
                          <li key={item.name}>
                            {
                              item.component ?
                                item.component
                                :

                                !item.children ? (
                                  <Link
                                    onClick={() => { setSidebarOpen(false) }}
                                    to={item.href}
                                    className={cn(
                                      item.current
                                        ? 'text-indigo-600'
                                        : 'text-gray-700 hover:bg-zinc-200 hover:text-indigo-600',
                                      'group flex gap-x-3 rounded-md p-2 text-sm leading-6',
                                    )}
                                  >
                                    <item.icon aria-hidden="true" className="h-6 w-6 shrink-0" />
                                    {item.name}
                                  </Link>
                                ) : (
                                  <Disclosure
                                    defaultOpen={item.defaultOpen}
                                    as="div">
                                    <DisclosureButton
                                      className={cn(
                                        item.current
                                          ? 'text-indigo-600'
                                          : 'text-gray-700 hover:bg-zinc-200 hover:text-indigo-600',
                                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6',
                                      )}
                                    >
                                      <item.icon aria-hidden="true" className="h-6 w-6 shrink-0" />
                                      <div className="size-full text-left">{item.name}</div>
                                      <ChevronRightIcon
                                        aria-hidden="true"
                                        className="h-5 w-5 shrink-0 text-zinc-500 group-data-[open]:rotate-90 group-data-[open]:text-zinc-500"
                                      />
                                    </DisclosureButton>
                                    <DisclosurePanel className="mt-1 px-2"
                                      as={motion.div}
                                      initial={{ opacity: 0, y: -24 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -24 }}
                                      transition={{ duration: 0.2, ease: easeOut }}
                                    >
                                      <ul role="list" className="space-y-1">
                                        {item.children.map((subItem) => (
                                          <li key={subItem.name}>
                                            <Link
                                              onClick={() => { setSidebarOpen(false) }}
                                              to={subItem.href}
                                              className={cn(
                                                subItem.current ? 'text-indigo-600'
                                                  : 'text-gray-700 hover:bg-zinc-200 hover:text-indigo-600',
                                                'group flex gap-x-3 rounded-md p-2 text-sm leading-6 pl-9',
                                              )}
                                            >
                                              {subItem.name}
                                            </Link>
                                          </li>
                                        ))}
                                      </ul>
                                    </DisclosurePanel>
                                  </Disclosure>
                                )}
                          </li>
                        ))}
                      </ul>
                    </nav>
                  </div>
                </DialogPanel>
              </div>
            </Dialog>

            {/* Sidebar for desktop (Large Screens)*/}
            <div className="fixed inset-y-0 left-0 w-64 max-lg:hidden">
              <div className="relative isolate flex min-h-svh w-full">

                <nav className="fixed flex flex-col inset-y-0 left-0 w-64 max-lg:hidden">
                  <div className="flex flex-row p-4 items-center">
                    <CheckBadgeIcon aria-hidden="true" className="h-6 w-6 text-indigo-400" />
                    <label className="group flex gap-x-3 rounded-md p-2 text-lg font-semibold leading-6">FacilityCare</label>
                  </div>

                  {hasRole('regular') && (<div className="px-2 border-b border-zinc-950/5">
                    <button
                      onClick={() => setOpenNotifications(true)}
                      className={cn(
                        openNotifications
                          ? 'text-indigo-600'
                          : 'text-gray-700 hover:bg-zinc-200 hover:text-indigo-600',
                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 w-full mb-2',
                      )}
                    >
                      <div className="w-full flex justify-between">
                        <div className="flex flex-row gap-2">
                          <BellIcon aria-hidden="true" className="h-6 w-6 shrink-0" />
                          Notifications
                        </div>
                        <NotificationCount />
                      </div>
                    </button>
                  </div>)}

                  <div className="flex flex-grow flex-col overflow-y-auto px-2 py-12">
                    <ul role="list" className="flex flex-1 flex-col gap-y-2">
                      {navigation.map((item) => (
                        <li key={item.name}>
                          {
                            item.component ?
                              item.component
                              :
                              !item.children ? (
                                <Link
                                  onClick={handleLinkClickMobile}
                                  to={item.href}
                                  className={cn(
                                    item.current
                                      ? 'text-indigo-600'
                                      : 'text-gray-700 hover:bg-zinc-200 hover:text-indigo-600',
                                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6',
                                  )}
                                >
                                  <item.icon aria-hidden="true" className="h-6 w-6 shrink-0" />
                                  {item.name}
                                </Link>
                              ) : (
                                <Disclosure
                                  defaultOpen={item.defaultOpen}
                                  as="div">
                                  <DisclosureButton
                                    className={cn(
                                      item.current
                                        ? 'text-indigo-600'
                                        : 'text-gray-700 hover:bg-zinc-200 hover:text-indigo-600',
                                      'group flex gap-x-3 rounded-md p-2 text-sm leading-6',
                                    )}
                                  >
                                    <item.icon aria-hidden="true" className="h-6 w-6 shrink-0" />
                                    <div className="size-full text-left">{item.name}</div>
                                    <ChevronRightIcon
                                      aria-hidden="true"
                                      className="h-5 w-5 shrink-0 text-zinc-500 group-data-[open]:rotate-90 group-data-[open]:text-zinc-500"
                                    />
                                  </DisclosureButton>
                                  <DisclosurePanel className="mt-1 px-2"
                                    as={motion.div}
                                    initial={{ opacity: 0, y: -24 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -24 }}
                                    transition={{ duration: 0.2, ease: easeOut }}
                                  >
                                    <ul role="list" className="space-y-1">
                                      {item.children.map((subItem) => (
                                        <li key={subItem.name}>
                                          <Link
                                            to={subItem.href}
                                            className={cn(
                                              subItem.current ? 'text-indigo-600'
                                                : 'text-gray-700 hover:bg-zinc-200 hover:text-indigo-600',
                                              'group flex gap-x-3 rounded-md p-2 text-sm leading-6 pl-9',
                                            )}
                                          >
                                            {subItem.name}
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  </DisclosurePanel>
                                </Disclosure>
                              )}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="max-lg:hidden flex flex-col border-t border-zinc-950/5">
                    <Popover className="relative">
                      {({ open, close }) => (
                        <>
                          <PopoverButton>
                            <div className="hover:bg-zinc-200 m-2 rounded-lg hover:cursor-pointer flex flex-row items-center p-2">
                              <div className="w-10 h-10 bg-gray-700 rounded-lg text-white font-semibold flex items-center justify-center">
                                {
                                  (user?.first_name?.[0]?.toUpperCase() || '') + (user?.last_name?.[0]?.toUpperCase() || '')
                                }

                              </div>
                              <div className="flex-grow flex flex-col justify-start px-2 text-left">
                                <span className="text-sm text-gray-700 truncate">{user.username}</span>
                                <span className="text-xs text-gray-500 truncate max-w-[130px] overflow-hidden text-ellipsis whitespace-nowrap">
                                  {user.email}
                                </span>
                              </div>
                              <div className="p-2 flex items-center">
                                <ChevronUpIcon className="w-4 h-4 text-gray-500" />
                              </div>
                            </div>
                          </PopoverButton>

                          <PopoverPanel
                            transition
                            anchor="top start" className="absolute mx-2 z-10 w-48 left-0 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition duration-200 ease-in-out [--anchor-gap:var(--spacing-5)] data-[closed]:-translate-y-1 data-[closed]:opacity-0">
                            <div className="py-1">
                              <Link to="/profile/" onClick={() => { close() }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                <UserIcon className="w-5 h-5 inline-block mr-2" /> My profile
                              </Link>
                              <Link onClick={() => { logout() }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                <ArrowLeftEndOnRectangleIcon className="w-5 h-5 inline-block mr-2" /> Sign out
                              </Link>
                            </div>
                          </PopoverPanel>
                        </>
                      )}
                    </Popover>
                  </div>
                </nav>
              </div>
            </div>
            <div className="sticky top-0 z-40 flex justify-between items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6 lg:hidden">
              <button type="button" onClick={() => setSidebarOpen(true)} className="-m-2.5 p-2.5 text-zinc-600 lg:hidden">
                <span className="sr-only">Open sidebar</span>
                <Bars3Icon aria-hidden="true" className="h-6 w-6" />
              </button>
              <div className="flex items-center gap-x-4 lg:gap-x-6">

                {hasRole('regular') && (
                  <button
                    onClick={handleNotificationsClick}
                    type="button"
                    className="-m-2.5 p-2.5 text-gray-400 hover:text-indigo-600 relative">
                    <span className="sr-only">View notifications</span>
                    <div className="relative">
                      <BellIcon aria-hidden="true" className="h-6 w-6" />
                      <div className="absolute -top-1 -right-1">
                        <NotificationCount />
                      </div>
                    </div>
                  </button>
                )}
                <div aria-hidden="true" className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10" />
                <Menu as="div" className="relative">
                  <MenuButton className="-m-1.5 flex items-center p-1.5">
                    <span className="sr-only">Open user menu</span>
                    <div className="w-8 h-8 rounded-full bg-gray-500 flex justify-center items-center font-semibold text-white text-xs">
                      {
                        (user?.first_name?.[0]?.toUpperCase() || '') + (user?.last_name?.[0]?.toUpperCase() || '')
                      }

                    </div>
                    <span className="hidden lg:flex lg:items-center">
                      <span aria-hidden="true" className="ml-4 text-sm font-semibold leading-6 text-gray-900">
                        Tom Cook
                      </span>
                      <ChevronDownIcon aria-hidden="true" className="ml-2 h-5 w-5 text-gray-400" />
                    </span>
                  </MenuButton>
                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                  >
                    {userNavigation.map((item) => (
                      <MenuItem key={item.name}>
                        <Link
                          onClick={item.onClick ? item.onClick : null}
                          to={item.href ? item.href : null}
                          className="block px-3 py-1 text-sm leading-6 text-gray-900 data-[focus]:bg-gray-50"
                        >
                          {item.name}
                        </Link>
                      </MenuItem>
                    ))}
                  </MenuItems>
                </Menu>
              </div>
            </div>
            <main className="flex flex-1 flex-col pb-2 lg:min-w-0 lg:pl-64 lg:pr-2 lg:pt-2">
              <Toaster />
              <Notifications openNotifications={openNotifications} setOpenNotifications={setOpenNotifications} />
              <div className="grow p-6 lg:rounded-lg lg:bg-white lg:p-10 lg:shadow-sm lg:ring-1 lg:ring-zinc-950/5">
                <div className="mx-auto max-w-7xl">
                { /* Main application entry point - Outlet renders the current path content */}
                  <Outlet />
                </div>
              </div>
            </main>
          </div>
        </RaiseRequestProvider>
      </NotificationProvider>
    </>
  );
};

export default NavigationFrame;