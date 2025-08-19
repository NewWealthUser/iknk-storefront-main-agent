"use client";
import React, { useState } from 'react';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import SidebarNav from '../sidebar-nav';

type NavItem = {
  title: string;
  type?: "collection" | "category";
  handle?: string;
  children?: NavItem[];
};

const Header = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const headerStyle: React.CSSProperties = {
    position: 'absolute',
    backgroundColor: isHovered ? 'white' : 'transparent',
    backgroundImage: isHovered ? 'none' : 'linear-gradient(0deg, rgba(38, 22, 10, 0) 0%, rgb(38, 22, 10) 100%)',
    color: isHovered ? 'black' : 'white',
    transition: 'background-color 0.8s ease-in-out, color 0.8s ease-in-out',
    top: '0px',
    height: '136px',
    width: '100%',
  };

  const iconAndTextStyle: React.CSSProperties = {
    color: isHovered ? 'black' : 'white',
    transition: 'color 0.8s ease-in-out',
  };

  const navLinkStyle: React.CSSProperties = {
    ...iconAndTextStyle,
    lineHeight: '1.75rem',
  };

  const logoFill = isHovered ? 'black' : 'white';

  const navItems: NavItem[] = [
    {
      title: "Shop By Room",
      children: [
        { title: "Living Room", type: "collection", handle: "living-room" },
        { title: "Dining Room", type: "collection", handle: "dining-room" },
        { title: "Outdoor Lounge", type: "collection", handle: "outdoor-lounge" },
        { title: "Patio / Poolside", type: "collection", handle: "patio-poolside" },
        { title: "Bar & Café", type: "collection", handle: "bar-cafe" },
        { title: "Balcony & Compact Spaces", type: "collection", handle: "balcony-compact-spaces" },
        { title: "Entertaining Spaces", type: "collection", handle: "entertaining-spaces" },
        { title: "Reading Nook", type: "collection", handle: "reading-nook" }
      ]
    },
    {
      title: "Tables",
      children: [
        { title: "Dining Tables", type: "collection", handle: "dining-tables" },
        { title: "Coffee Tables", type: "collection", handle: "coffee-tables" },
        { title: "Side Tables", type: "collection", handle: "side-tables" },
        { title: "Café Tables", type: "collection", handle: "cafe-tables" },
        { title: "Bar Tables", type: "collection", handle: "bar-tables" },
        { title: "Table Covers", type: "collection", handle: "table-covers" }
      ]
    },
    { title: "Seating", type: "collection", handle: "seating" },
    { title: "Lounging", type: "collection", handle: "lounging" },
    { title: "Umbrellas", type: "collection", handle: "umbrellas" },
    { title: "Accessories", type: "collection", handle: "accessories" },
    { title: "Materials", type: "collection", handle: "materials" },
    { title: "SALE", type: "collection", handle: "sale" },
    { title: "Ikonik", type: "collection", handle: "ikonik" }
  ];

  return (
    <>
      <header
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="MuiPaper-root MuiPaper-elevation MuiPaper-elevation4 MuiAppBar-root MuiAppBar-colorPrimary MuiAppBar-positionFixed jss19 header-height mui-fixed css-1p6sy91"
        id="app-navigation-bar"
        data-testid="rhr-header"
        style={headerStyle}
      >
        <div
          className="MuiToolbar-root MuiToolbar-gutters MuiToolbar-regular !md:min-h-[132px] z-[1100] p-0 sm:h-[124px] sm:min-h-[124px] md:h-[120px] css-f4o4h3"
          style={{ minHeight: 'auto' }}
        >
          <div className="flex-auto sm:h-[124px] md:h-[120px]">
            <div className="relative p-4 pb-[20px] sm:p-0 sm:px-[32px] sm:pb-[20px] sm:pt-[12px] md:px-[40px] md:pb-[15px] xl:px-[80px] customXs:pb-5">
              <div className="grid h-full w-full grid-cols-3 items-center justify-end">
                <div className="sm:mt-0 sm:translate-y-1">
                  <div className="flex w-full items-center gap-8 place-self-start sm:gap-10 lg:gap-12">
                    <div className="flex items-center md:hidden">
                      <div className="!h-6 px-[16px] pb-[17px] pl-[10px]" style={{ padding: '0px', height: '100%', width: '100%' }}>
                        <button onClick={() => setIsSidebarOpen(true)} id="hamburgerIcon" data-testid="hamburgerIcon" className="!h-6 p-0" aria-label="Open Hamburger Menu" aria-expanded="false">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-black" style={iconAndTextStyle}>
                            <line x1="1" y1="3.625" x2="23" y2="3.625" stroke="currentColor" strokeWidth="0.75"></line>
                            <line x1="1" y1="11.625" x2="23" y2="11.625" stroke="currentColor" strokeWidth="0.75"></line>
                            <line x1="1" y1="19.625" x2="23" y2="19.625" stroke="currentColor" strokeWidth="0.75"></line>
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-[6px]">
                      <button className="p-0">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-black" data-testid="search-icon" style={iconAndTextStyle}>
                          <circle cx="11.5004" cy="9.87932" r="7.1762" stroke="currentColor" strokeWidth="0.75"></circle>
                          <line x1="16.5699" y1="15.1098" x2="21.917" y2="20.457" stroke="currentColor" strokeWidth="0.75"></line>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex w-full items-center justify-center place-self-center">
                    <a id="container-rhr-header_logo-rhr" href="https://rh.com/us/en" data-analytics-worhlogo="worh-logo" className="leading-[0]" aria-label="The World of RH Homepage">
                      <svg className="fill-current !h-[46px] !w-[48px] sm:!h-[67px] sm:!w-[70px]" viewBox="0 0 58 55" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_11443_87270)">
                          <path d="M6.5552 1.73321L6.28396 0.238051H4.47213L2.4906 6.47012C2.38905 6.77637 2.30888 7.14949 2.30888 7.30864C2.30888 7.59215 2.46789 7.78473 3.38449 7.79543L3.35109 7.90911H0L0.0227147 7.79543C0.577221 7.79543 1.15444 7.72723 1.34685 7.10402L3.52078 0.238051H1.69826L0.407529 1.69978H0.30598L0.792342 0.0909424H7.14311L6.64472 1.73321H6.55386H6.5552Z" fill={logoFill} stroke="none"></path>
                          <path d="M9.82611 5.34808C9.31704 6.44738 9.01106 7.2177 9.01106 7.35411C9.01106 7.42231 9.03377 7.50122 9.12463 7.50122C9.33975 7.50122 9.79271 7.08129 10.2684 6.52629L10.3699 6.61723C9.73659 7.33137 9.12463 8.03348 8.45655 8.03348C8.33229 8.03348 8.196 7.88637 8.196 7.73926C8.196 7.39958 8.52469 6.652 9.1126 5.36011C9.53082 4.43065 9.81409 3.78471 9.81409 3.60417C9.81409 3.46776 9.74594 3.33269 9.58828 3.33269C9.05648 3.33269 8.04902 4.62457 7.26737 5.96192C6.85984 6.65333 6.52046 7.36748 6.32805 7.91045H5.60385L8.61422 1.00836C8.68236 0.861256 8.76119 0.645942 8.76119 0.476098C8.76119 0.215314 8.51267 0.147109 7.99157 0.13641L8.04769 0H9.77935L7.40232 5.26917H7.43572C8.02497 4.33971 9.1901 2.89002 10.0399 2.89002C10.3339 2.89002 10.5837 3.01439 10.5837 3.32065C10.5837 3.69511 10.3459 4.21534 9.82478 5.34941L9.82611 5.34808Z" fill={logoFill} stroke="none"></path>
                          <path d="M13.9241 4.98564C13.2908 5.3708 12.7122 5.65432 12.2152 5.89237C12.0562 6.30026 11.9212 6.84456 11.9212 7.13878C11.9212 7.433 11.9894 7.74995 12.3622 7.74995C12.9394 7.74995 13.4378 7.25112 14.0257 6.43533L14.1272 6.51424C13.5607 7.37549 12.9274 8.03213 12.1577 8.03213C11.5244 8.03213 11.1609 7.57877 11.1609 6.94486C11.1609 5.67572 12.8138 2.88867 14.2849 2.88867C14.7833 2.88867 15.0438 3.16015 15.0438 3.53461C15.0438 4.05618 14.6363 4.55501 13.9228 4.9843L13.9241 4.98564ZM14.1954 3.03712C13.6863 3.03712 12.9394 4.05752 12.2713 5.69979C13.0182 5.32533 14.5348 4.329 14.5348 3.46775C14.5348 3.19626 14.4332 3.03712 14.1954 3.03712Z" fill={logoFill} stroke="none"></path>
                          <path d="M9.23286 11.0733L7.22862 17.2144H7.11505L5.36067 11.8436H5.33796L3.37915 17.2144H3.26558L0.935314 10.4394C0.709503 9.77073 0.527785 9.43104 0.00668335 9.35214V9.23846H2.56543V9.35214C1.96549 9.37487 1.71697 9.47651 1.71697 9.7373C1.71697 9.82824 1.7624 9.97535 1.7958 10.089L3.67444 15.6858H3.69716L5.23641 11.4932L4.8516 10.3378C4.60307 9.60089 4.39864 9.37487 3.78801 9.35214V9.23846H6.64071V9.35214C5.87109 9.39761 5.70139 9.57815 5.70139 9.91918C5.70139 10.0208 5.76954 10.3271 5.84837 10.5531L7.5012 15.5722H7.52392L8.93891 11.3341C9.13131 10.7564 9.30101 10.1666 9.30101 9.83894C9.30101 9.48721 9.02977 9.38557 8.36169 9.35214V9.23846H10.3312V9.35214C9.8328 9.49925 9.66311 9.74933 9.23286 11.0747V11.0733Z" fill={logoFill} stroke="none"></path>
                          <path d="M14.2368 17.2144C11.2478 17.2144 10.4902 14.6881 10.4902 13.2826C10.4902 9.87232 13.1839 9.13544 14.2942 9.13544C16.1622 9.13544 18.1878 10.4153 18.1878 13.2371C18.1878 14.5397 17.4743 17.2144 14.2368 17.2144ZM14.373 9.28255C12.9687 9.28255 11.4976 10.5169 11.4976 13.328C11.4976 15.322 12.5171 17.0673 14.2368 17.0673C16.241 17.0673 17.1803 14.9369 17.1803 13.2264C17.1803 10.3484 15.4032 9.28388 14.373 9.28388V9.28255Z" fill={logoFill} stroke="none"></path>
                          <path d="M21.9905 13.9179C21.6057 13.5661 21.0165 13.51 20.4967 13.51V16.2288C20.4967 16.852 20.8134 16.9309 21.4587 16.9309V17.0553H18.7423V16.9309C19.3422 16.9309 19.5801 16.852 19.5801 16.2288V10.0649C19.5801 9.45378 19.2861 9.36284 18.7877 9.36284V9.23846C19.7725 9.23846 20.6891 9.19299 21.7086 9.19299C23.0675 9.19299 24.4704 9.72526 24.4704 11.3007C24.4704 12.4682 23.6661 13.0566 22.6479 13.3736C23.304 13.8149 24.0522 15.2886 24.6521 16.2515C24.9127 16.6701 25.2294 16.9202 25.7384 16.9309V17.0553H23.9948C23.5191 16.2275 22.704 14.5625 21.9905 13.9165V13.9179ZM21.4133 9.35214C20.824 9.35214 20.4967 9.45378 20.4967 10.0997V13.3294C20.8935 13.3294 21.2329 13.3187 21.5723 13.296C22.7722 13.205 23.4736 12.4909 23.4736 11.29C23.4736 10.089 22.6359 9.35214 21.4133 9.35214Z" fill={logoFill} stroke="none"></path>
                          <path d="M26.4733 17.0553V16.9416C27.0626 16.9416 27.3672 16.8507 27.3672 16.2275V10.0636C27.3672 9.44039 26.937 9.34945 26.496 9.34945V9.23578H29.3608V9.34945C28.6245 9.36015 28.2851 9.57547 28.2851 10.1773V15.9667C28.2851 16.9068 28.6245 16.9416 29.7229 16.9416C31.3303 16.9416 31.862 16.8507 32.4847 15.865C32.7907 15.3782 33.0392 14.9704 33.2436 14.6079H33.3452L32.7452 17.0553H26.4733Z" fill={logoFill} stroke="none"></path>
                          <path d="M36.6508 17.1235C35.6313 17.1235 34.7722 17.0553 33.7754 17.0553H33.6164V16.9416C34.1255 16.9416 34.4315 16.8399 34.4315 16.2274V10.0636C34.4315 9.4524 34.0012 9.36146 33.5937 9.34942V9.23575C34.7481 9.22505 35.7222 9.16754 36.8887 9.16754C40.4095 9.16754 41.4851 11.0933 41.4851 13.201C41.4851 15.3087 40.2732 17.1208 36.6508 17.1208V17.1235ZM36.6174 9.31732C35.769 9.31732 35.3494 9.431 35.3494 10.2468V15.9693C35.3494 16.6942 35.757 16.955 36.8326 16.967H36.8887C39.0626 16.967 40.4429 15.5173 40.4429 13.3187C40.4429 10.7697 39.1749 9.31866 36.6161 9.31866L36.6174 9.31732Z" fill={logoFill} stroke="none"></path>
                          <path d="M44.8281 17.181C43.8995 17.181 43.5828 16.3425 43.5828 15.504C43.5828 14.2014 44.8736 12.0362 46.4462 12.0362C47.3067 12.0362 47.6461 12.7276 47.6461 13.7587C47.6461 15.084 46.4235 17.181 44.8268 17.181H44.8281ZM46.481 12.1499C45.4615 12.1499 44.1373 15.2766 44.1373 16.285C44.1373 16.6474 44.2616 17.0673 44.6919 17.0673C45.6659 17.0673 47.0916 14.3592 47.0916 12.9764C47.0916 12.6246 47.0234 12.1499 46.4796 12.1499H46.481Z" fill={logoFill} stroke="none"></path>
                          <path d="M52.0234 9.96326C51.843 9.96326 51.7174 9.84958 51.6613 9.69178C51.5931 9.52193 51.4568 9.37482 51.2992 9.37482C50.8582 9.37482 50.5856 10.224 50.4841 10.5878L50.0084 12.1859H51.1295L51.0386 12.4467H49.9403L49.1359 15.0867C48.3329 17.7266 47.5512 19.4946 46.2271 19.4946C45.8423 19.4946 45.6165 19.2686 45.6165 19.0185C45.6165 18.7684 45.8089 18.6668 45.9679 18.6668C46.1376 18.6668 46.2618 18.7911 46.3527 19.0292C46.3861 19.1201 46.477 19.2552 46.6694 19.2552C47.0542 19.2552 47.3829 18.5758 47.7102 17.4992L49.2268 12.4454H48.2754L48.3663 12.1846H49.2949C49.3965 11.8677 49.4994 11.528 49.6236 11.1869C50.0084 10.0997 50.5856 9.13544 51.7174 9.13544C52.1142 9.13544 52.3855 9.32802 52.3855 9.61154C52.3855 9.81481 52.2385 9.96326 52.0234 9.96326Z" fill={logoFill} stroke="none"></path>
                          <path d="M6.44029 37.2038V21.2559C6.44563 19.5053 6.71153 19.0011 8.60086 18.9998C9.43462 18.9998 11.7208 18.9998 11.7208 18.9998C19.0309 18.9998 22.4034 22.5638 22.4034 27.9747C22.4034 33.0955 18.455 37.1717 13.3616 37.2038H6.44029ZM51.6092 37.2038H33.8088V20.8854C33.8088 19.4718 34.0934 19.0011 36.0389 19.0011H37.0878V18.64H27.418V19.0011H28.4188C30.3976 19.0011 30.6876 19.4611 30.6876 20.8854V54.6415C30.6876 54.6415 30.3736 54.6415 30.2493 54.6415C27.6598 54.6415 27.1802 53.1196 26.0444 50.6723C22.517 43.0761 20.7332 38.4382 11.3787 37.478L13.1692 37.4846C18.3 37.5127 25.5113 35.607 25.5113 27.9132C25.5113 19.1562 15.6023 18.6467 13.0636 18.6387C13.0636 18.6387 5.14421 18.6387 0.0507746 18.6387V18.9998C0.0507746 18.9998 0.420891 18.9998 0.889883 18.9998C2.99834 18.9984 3.31635 19.3916 3.31768 21.2532V52.6248C3.31768 54.3059 2.87675 54.6135 1.06626 54.6415H0.0494385V55.0013H9.71521V54.6415H8.66098C6.99747 54.588 6.43895 54.3447 6.43895 52.6248V37.5649H8.92688C11.6593 37.5649 13.9695 38.0838 15.7533 39.5335C20.7385 43.5883 21.0191 55.0013 29.3621 55.0013H37.0851V54.6415H36.1925C34.2003 54.6415 33.8075 54.2002 33.8075 52.3761V37.5649H51.6065L51.6011 52.6315C51.5958 54.2885 51.2123 54.6415 49.1987 54.6415C48.7177 54.6415 48.3302 54.6415 48.3302 54.6415V55.0013H57.996V54.6415C57.996 54.6415 57.6232 54.6415 57.1422 54.6415C55.2181 54.6415 54.7237 54.2938 54.7224 52.6315V20.8948C54.7224 19.3542 55.154 19.0011 57.1422 18.9998C57.6232 18.9998 57.996 18.9998 57.996 18.9998V18.6387H48.3302V18.9998C48.3302 18.9998 48.7177 18.9998 49.1987 18.9998C51.211 18.9998 51.5958 19.3354 51.5971 21.0085L51.6051 37.2025L51.6092 37.2038Z" fill={logoFill} stroke="none"></path>
                        </g>
                        <defs>
                          <clipPath id="clip0_11443_87270">
                            <rect width="58" height="55" fill="white"></rect>
                          </clipPath>
                        </defs>
                      </svg>
                    </a>
                  </div>
                </div>
                <div className="sm:mt-0 sm:translate-y-1">
                  <div className="flex h-full w-full items-center justify-end gap-6 sm:gap-8">
                    <button className="inline-flex h-4 items-center justify-center gap-1 p-0 outline-none" type="button" id="radix-:r9:" aria-haspopup="menu" aria-expanded="false" data-state="closed" style={iconAndTextStyle}>
                      <p className="font-rhc font-thin h-[13px] whitespace-nowrap text-[13px] capitalize leading-[120%] tracking-[0.52px]">USA</p>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-black" style={iconAndTextStyle}>
                        <path d="M12.1699 6.75L8.16992 10.75L4.16992 6.75" stroke="currentColor" strokeWidth="0.75"></path>
                      </svg>
                    </button>
                    <LocalizedClientLink href="/account" style={iconAndTextStyle}>
                      <div className="MuiGrid-root MuiGrid-item flex">
                        <button className="p-0" style={iconAndTextStyle}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="">
                            <path d="M5.37543 19.4979H19.2354V14.5083C19.2354 13.2544 18.2189 12.2379 16.965 12.2379H7.64581C6.39192 12.2379 5.37543 13.2544 5.37543 14.5083V19.4979Z" stroke="currentColor" strokeWidth="0.75"></path>
                            <path d="M15.5601 6.63C15.5601 8.42769 14.1028 9.885 12.3051 9.885C10.5074 9.885 9.05011 8.42769 9.05011 6.63C9.05011 4.83231 10.5074 3.375 12.3051 3.375C14.1028 3.375 15.5601 4.83231 15.5601 6.63Z" stroke="currentColor" strokeWidth="0.75"></path>
                          </svg>
                        </button>
                      </div>
                    </LocalizedClientLink>
                    <LocalizedClientLink href="/cart" className="MuiTypography-root MuiTypography-inherit MuiLink-root MuiLink-underlineNone flex items-end css-1bklnqp" id="container-rhrHeader_cart-btn" data-analytics-id="link" aria-label="0 Items in Cart" data-ctaname="0 Items in Cart">
                      <div className="flex items-center gap-2">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-black" style={iconAndTextStyle}>
                          <path d="M4.51758 7.75806H18.7976V17.342C18.7976 18.8089 17.6084 19.9981 16.1415 19.9981H7.17363C5.70673 19.9981 4.51758 18.8089 4.51758 17.342V7.75806Z" stroke="currentColor" strokeWidth="0.75"></path>
                          <mask id="mask0_5301_119153" maskUnits="userSpaceOnUse" x="4" y="2" width="16" height="7">
                            <rect width="14.28" height="4.76" transform="matrix(1 0 0 -1 4.51758 7.75806)" fill="#D9D9D9" stroke="currentColor" strokeWidth="0.75"></rect>
                          </mask>
                          <g mask="url(#mask0_5301_119153)">
                            <path d="M15.0225 6.73622C15.0225 8.59465 13.516 10.1012 11.6575 10.1012C9.7991 10.1012 8.29254 8.59465 8.29254 6.73622C8.29254 4.87778 9.7991 3.37122 11.6575 3.37122C13.516 3.37122 15.0225 4.87778 15.0225 6.73622Z" stroke="currentColor" strokeWidth="0.75"></path>
                          </g>
                        </svg>
                      </div>
                    </LocalizedClientLink>
                  </div>
                </div>
              </div>
            </div>
            <div className="jss20 hidden md:block">
              <ul className="flex flex-wrap justify-center gap-x-8 p-0 my-0" role="menubar" aria-label="Main">
                {navItems.map((item) => (
                  <div key={item.title} className="relative group">
                    <div className="mt-0 flex pt-0 no-underline underline-offset-[5px] hover:underline hover:text-white">
                      <LocalizedClientLink
                        href={item.type === "collection" ? `/collections/${item.handle}` : item.type === "category" ? `/categories/${item.handle}` : `/${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                        className="p-0 text-black"
                      >
                        <span className="p-0 flex items-end" style={{ lineHeight: 'inherit' }}>
                          <span
                            className="uppercase h-[18px] font-rhc font-thin leading-normal tracking-wider md:text-[14px] lg:text-base"
                            style={item.title === 'SALE' ? { ...navLinkStyle, color: 'rgb(202, 32, 34)' } : navLinkStyle}
                          >
                            {item.title}
                          </span>
                        </span>
                      </LocalizedClientLink>
                    </div>
                    {item.children && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-max hidden group-hover:block bg-white text-black p-4 rounded-md shadow-lg z-50">
                        <ul className="space-y-2">
                          {item.children.map((child) => (
                            <li key={child.title}>
                              <LocalizedClientLink
                                href={child.type === "collection" ? `/collections/${child.handle}` : child.type === "category" ? `/categories/${child.handle}` : `/${child.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                                className="block text-sm text-gray-700 hover:text-black hover:bg-gray-100 p-2 rounded"
                              >
                                {child.title}
                              </LocalizedClientLink>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </header>
      <SidebarNav
        isOpen={isSidebarOpen}
        close={() => setIsSidebarOpen(false)}
        navItems={navItems}
      />
    </>
  );
};

export default Header;