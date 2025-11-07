"use client"

import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"

interface NavItem {
  label: string
  href?: string
  onClick?: () => void
}

interface LandingNavbarProps {
  brandLabel?: string
  brandHref?: string
  navItems?: NavItem[]
  rightButtonLabel?: string
  rightButtonHref?: string
  rightButtonOnClick?: () => void
  userRole?: "student" | "faculty" | "admin"
}

export default function LandingNavbar({
  brandLabel = "Indekun",
  brandHref = "/",
  navItems = [],
  rightButtonLabel = "Log in",
  rightButtonHref = "/login",
  rightButtonOnClick,
  userRole,
}: LandingNavbarProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleBrandClick = () => {
    if (brandHref) {
      router.push(brandHref)
    }
  }

  const handleRightButtonClick = () => {
    if (rightButtonOnClick) {
      rightButtonOnClick()
    } else if (rightButtonLabel === "Logout" || rightButtonLabel === "Log out") {
      // Handle logout
      localStorage.removeItem("userRole")
      localStorage.removeItem("userEmail")
      router.push("/login")
    } else if (rightButtonHref) {
      router.push(rightButtonHref)
    }
  }

  // Default nav items for dashboard pages
  const defaultNavItems: NavItem[] = userRole
    ? [
        ...(userRole === "admin"
          ? [{ label: "Admin", href: "/admin" }]
          : [
              { label: "Dashboard", href: "/dashboard" },
              { label: "Equipment", href: "/equipment" },
              { label: "My Bookings", href: "/bookings" },
            ]),
        ...(userRole === "faculty" && userRole !== "admin"
          ? [{ label: "Admin", href: "/admin" }]
          : []),
      ]
    : []

  const itemsToUse = navItems.length > 0 ? navItems : defaultNavItems

  return (
    <div className="w-full h-12 sm:h-14 md:h-16 lg:h-[84px] absolute left-0 top-0 flex justify-center items-center z-20 px-6 sm:px-8 md:px-12 lg:px-0">
      <div className="w-full max-w-[calc(100%-32px)] sm:max-w-[calc(100%-48px)] md:max-w-[calc(100%-64px)] lg:max-w-[900px] lg:w-[900px] h-10 sm:h-11 md:h-12 py-1.5 sm:py-2 px-3 sm:px-4 md:px-5 pr-2 sm:pr-3 bg-[#F7F5F3] backdrop-blur-sm border border-[rgba(0,0,0,0.3)] overflow-hidden rounded-[50px] flex justify-between items-center relative z-30">
        <div className="flex justify-center items-center">
          <div className="flex justify-start items-center">
            {brandHref ? (
              <Link
                href={brandHref}
                className="flex flex-col justify-center text-[#2F3037] text-sm sm:text-base md:text-lg lg:text-xl font-medium leading-5 font-sans cursor-pointer hover:opacity-80 transition-opacity"
              >
                {brandLabel}
              </Link>
            ) : (
              <button
                onClick={handleBrandClick}
                className="flex flex-col justify-center text-[#2F3037] text-sm sm:text-base md:text-lg lg:text-xl font-medium leading-5 font-sans cursor-pointer hover:opacity-80 transition-opacity"
              >
                {brandLabel}
              </button>
            )}
          </div>
          {itemsToUse.length > 0 && (
            <div className="pl-3 sm:pl-4 md:pl-5 lg:pl-6 flex justify-start items-start hidden sm:flex flex-row gap-1 sm:gap-2 md:gap-2 lg:gap-2">
              {itemsToUse.map((item, index) => {
                const isActive = item.href ? pathname === item.href || pathname.startsWith(item.href + "/") : false
                return (
                  <div key={index} className="flex justify-start items-center">
                    {item.href ? (
                      <Link
                        href={item.href}
                        className={`flex justify-start items-center cursor-pointer transition-all duration-200 ${
                          isActive
                            ? "px-3 sm:px-4 md:px-4 lg:px-5 py-1.5 sm:py-2 bg-[#37322F] rounded-full"
                            : "px-3 sm:px-4 md:px-4 lg:px-5 py-1.5 sm:py-2 hover:bg-[rgba(55,50,47,0.08)] rounded-full"
                        }`}
                      >
                        <div
                          className={`flex flex-col justify-center text-xs md:text-[13px] font-medium leading-[14px] font-sans ${
                            isActive ? "text-white" : "text-[rgba(49,45,43,0.80)]"
                          }`}
                        >
                          {item.label}
                        </div>
                      </Link>
                    ) : (
                      <button
                        onClick={item.onClick}
                        className="flex justify-start items-center cursor-pointer px-3 sm:px-4 md:px-4 lg:px-5 py-1.5 sm:py-2 hover:bg-[rgba(55,50,47,0.08)] rounded-full transition-all duration-200"
                      >
                        <div className="flex flex-col justify-center text-[rgba(49,45,43,0.80)] text-xs md:text-[13px] font-medium leading-[14px] font-sans">
                          {item.label}
                        </div>
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
        <div className="h-6 sm:h-7 md:h-8 flex justify-start items-start gap-2 sm:gap-3">
          {rightButtonHref ? (
            <Link
              href={rightButtonHref}
              className="px-2 sm:px-3 md:px-[14px] py-1 sm:py-[6px] bg-white shadow-[0px_1px_2px_rgba(55,50,47,0.12)] overflow-hidden rounded-full flex justify-center items-center cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="flex flex-col justify-center text-[#37322F] text-xs md:text-[13px] font-medium leading-5 font-sans">
                {rightButtonLabel}
              </div>
            </Link>
          ) : (
            <button
              onClick={handleRightButtonClick}
              className="px-2 sm:px-3 md:px-[14px] py-1 sm:py-[6px] bg-white shadow-[0px_1px_2px_rgba(55,50,47,0.12)] overflow-hidden rounded-full flex justify-center items-center cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="flex flex-col justify-center text-[#37322F] text-xs md:text-[13px] font-medium leading-5 font-sans">
                {rightButtonLabel}
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

