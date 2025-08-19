"use client";
import { Dialog, Disclosure, Transition } from '@headlessui/react';
import React, { Fragment } from 'react';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import X from '@modules/common/icons/x';
import ChevronDown from '@modules/common/icons/chevron-down';

type NavItem = {
  title: string;
  type?: "collection" | "category";
  handle?: string;
  children?: NavItem[];
};

type SidebarNavProps = {
  isOpen: boolean;
  close: () => void;
  navItems: NavItem[];
};

const SidebarNav = ({ isOpen, close, navItems }: SidebarNavProps) => {
  const getHref = (item: NavItem) => {
    if (item.type === "collection" && item.handle) {
      return `/collections/${item.handle}`;
    }
    if (item.type === "category" && item.handle) {
      return `/categories/${item.handle}`;
    }
    return `/${item.title.toLowerCase().replace(/\s+/g, '-')}`;
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50 md:hidden" onClose={close}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="w-full max-w-xs transform overflow-hidden bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-8">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    Menu
                  </Dialog.Title>
                  <button onClick={close} aria-label="Close menu">
                    <X size={24} />
                  </button>
                </div>
                <nav>
                  <ul className="flex flex-col gap-y-4">
                    {navItems.map((item) => (
                      <li key={item.title}>
                        {!item.children ? (
                          <LocalizedClientLink
                            href={getHref(item)}
                            className="text-lg text-gray-700 hover:text-black"
                            onClick={close}
                          >
                            <span style={item.title === 'SALE' ? { color: 'rgb(202, 32, 34)' } : {}}>
                              {item.title}
                            </span>
                          </LocalizedClientLink>
                        ) : (
                          <Disclosure as="div">
                            {({ open }) => (
                              <>
                                <Disclosure.Button className="flex items-center justify-between w-full text-lg text-gray-700 hover:text-black">
                                  <span style={item.title === 'SALE' ? { color: 'rgb(202, 32, 34)' } : {}}>
                                    {item.title}
                                  </span>
                                  <ChevronDown
                                    size={20}
                                    className={`transition-transform duration-200 ${open ? 'transform rotate-180' : ''}`}
                                  />
                                </Disclosure.Button>
                                <Transition
                                  enter="transition duration-100 ease-out"
                                  enterFrom="transform scale-95 opacity-0"
                                  enterTo="transform scale-100 opacity-100"
                                  leave="transition duration-75 ease-out"
                                  leaveFrom="transform scale-100 opacity-100"
                                  leaveTo="transform scale-95 opacity-0"
                                >
                                  <Disclosure.Panel as="ul" className="pl-4 pt-2 space-y-2">
                                    {item.children?.map((child) => (
                                      <li key={child.title}>
                                        <LocalizedClientLink
                                          href={getHref(child)}
                                          className="text-gray-600 hover:text-black"
                                          onClick={close}
                                        >
                                          {child.title}
                                        </LocalizedClientLink>
                                      </li>
                                    ))}
                                  </Disclosure.Panel>
                                </Transition>
                              </>
                            )}
                          </Disclosure>
                        )}
                      </li>
                    ))}
                  </ul>
                </nav>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default SidebarNav;