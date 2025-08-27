import React from 'react';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import Input from '@modules/common/components/input';
import { Button, Text, Heading } from '@medusajs/ui';
import { ArrowUpRightMini } from '@medusajs/icons';
import { HttpTypes } from "@medusajs/types" // Added missing import

const Footer = () => {
  return (
    <footer className="bg-ui-bg-subtle px-8 py-10 text-ui-fg-base">
      <div className="max-w-7xl mx-auto">
        <div className="border-b border-ui-border-base pb-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
            <div className="flex flex-col gap-y-2">
              <Heading level="h3" className="text-xl font-medium uppercase tracking-wider">
                Inspiration, Delivered.
              </Heading>
              <Text className="text-sm text-ui-fg-subtle">
                Discover our products, places, services and spaces.
              </Text>
            </div>
            <form className="w-full flex flex-col sm:flex-row gap-2">
              <Input
                label="Enter your email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="flex-grow"
              />
              <Button type="submit" variant="secondary" className="h-11 px-6 py-2">
                Sign Up
              </Button>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <Heading level="h3" className="text-sm font-medium uppercase tracking-wider mb-4">
              Resources
            </Heading>
            <ul className="space-y-2 text-sm text-ui-fg-subtle">
              <li><LocalizedClientLink href="/store-locations">Locate a Gallery</LocalizedClientLink></li>
              <li>
                <a target="_blank" href="https://catalogs.rh.com/BookshelfView/" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-ui-fg-base">
                  <span>View Sourcebooks</span>
                  <ArrowUpRightMini className="w-4 h-4" />
                </a>
              </li>
              <li><LocalizedClientLink href="/customer-experience/sourcebook-request">Request a Sourcebook</LocalizedClientLink></li>
              <li><LocalizedClientLink href="/membership">RH Members Program</LocalizedClientLink></li>
              <li><LocalizedClientLink href="/trade">RH Trade</LocalizedClientLink></li>
              <li><LocalizedClientLink href="/contract">RH Contract</LocalizedClientLink></li>
              <li><LocalizedClientLink href="/customer-experience/credit-card">RH Credit Card</LocalizedClientLink></li>
              <li><LocalizedClientLink href="/sitemap">Site Map</LocalizedClientLink></li>
            </ul>
          </div>
          <div>
            <Heading level="h3" className="text-sm font-medium uppercase tracking-wider mb-4">
              Customer Experience
            </Heading>
            <ul className="space-y-2 text-sm text-ui-fg-subtle">
              <li><LocalizedClientLink href="/customer-experience/contact-us">Contact Us</LocalizedClientLink></li>
              <li><LocalizedClientLink href="/customer-experience/placing-an-order">Placing an Order</LocalizedClientLink></li>
              <li><LocalizedClientLink href="/customer-experience/shipping-and-delivery">Shipping & Delivery</LocalizedClientLink></li>
              <li><LocalizedClientLink href="/customer-experience/return-policy">Returns & Exchanges</LocalizedClientLink></li>
              <li><LocalizedClientLink href="/customer-experience/lifetime-guarantee">Lifetime Guarantee</LocalizedClientLink></li>
              <li><LocalizedClientLink href="/catalog/category/products.jsp?categoryId=cat7440069">RH Gift Card</LocalizedClientLink></li>
              <li><LocalizedClientLink href="/gift-registry">Gift Registry</LocalizedClientLink></li>
              <li><LocalizedClientLink href="/customer-experience/frequently-asked-questions">FAQs</LocalizedClientLink></li>
            </ul>
          </div>
          <div>
            <Heading level="h3" className="text-sm font-medium uppercase tracking-wider mb-4">
              Our Company
            </Heading>
            <ul className="space-y-2 text-sm text-ui-fg-subtle">
              <li>
                <a target="_blank" href="https://rh.online/letters-blog" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-ui-fg-base">
                  <span>Letters From The CEO</span>
                  <ArrowUpRightMini className="w-4 h-4" />
                </a>
              </li>
              <li>
                <a target="_blank" href="https://ir.rh.com/corporate-governance/leadership" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-ui-fg-base">
                  <span>Leadership Team</span>
                  <ArrowUpRightMini className="w-4 h-4" />
                </a>
              </li>
              <li>
                <a target="_blank" href="https://ir.rh.com" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-ui-fg-base">
                  <span>Investor Relations</span>
                  <ArrowUpRightMini className="w-4 h-4" />
                </a>
              </li>
              <li>
                <a target="_blank" href="https://rh.online/" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-ui-fg-base">
                  <span>Press</span>
                  <ArrowUpRightMini className="w-4 h-4" />
                </a>
              </li>
              <li>
                <a target="_blank" href="https://careers.rh.com" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-ui-fg-base">
                  <span>Careers</span>
                  <ArrowUpRightMini className="w-4 h-4" />
                </a>
              </li>
            </ul>
          </div>
          <div>
            <Heading level="h3" className="text-sm font-medium uppercase tracking-wider mb-4">
              Legal
            </Heading>
            <ul className="space-y-2 text-sm text-ui-fg-subtle">
              <li><LocalizedClientLink href="/our-company/privacy-policy">Privacy</LocalizedClientLink></li>
              <li><LocalizedClientLink href="/our-company/terms-of-use">Terms of Use</LocalizedClientLink></li>
              <li><LocalizedClientLink href="/our-company/text-messaging-terms">Text Messaging Terms</LocalizedClientLink></li>
              <li><LocalizedClientLink href="/our-company/canada-shipping">RH in Canada</LocalizedClientLink></li>
              <li>
                <a target="_blank" href="https://preferences.restorationhardware.com/dont_sell" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-ui-fg-base">
                  <span>CPRA Opt-Out</span>
                  <ArrowUpRightMini className="w-4 h-4" />
                </a>
              </li>
              <li><LocalizedClientLink href="/customer-experience/safety-recalls">Safety Recalls</LocalizedClientLink></li>
            </ul>
          </div>
        </div>

        <div className="flex justify-between items-center border-t border-ui-border-base pt-8">
          <Text className="text-xs text-ui-fg-muted">
            United States ($) / English
          </Text>
          <Text className="text-xs text-ui-fg-muted">
            © 2025 RH
          </Text>
        </div>
      </div>
    </footer>
  );
};

export default Footer;