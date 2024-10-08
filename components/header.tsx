import React, { useState, useRef, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null); // Explicitly type the ref
  const router = useRouter();
  const supabase = createClient();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = async () => {
    let { error } = await supabase.auth.signOut();
    if (error) {
      console.log("Error logging out:", error.message);
    } else {
      router.push("/login"); // Redirect the user to the login page after logout
    }
  };

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false); // Close the dropdown
      }
    };

    // Add event listener when the component mounts
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const goToSettings = () => {
    router.push("/settings");
  };

  const goToHome = () => {
    router.push("/");
  };

  return (
    <main>
      <div className="flex justify-between items-center py-5 px-5">
        <div className="cursor-pointer" onClick={goToHome}>
          <img height={80} width={250} src="./images/logo.png" alt="logo" />
        </div>
        <div className="relative" ref={dropdownRef}>
          <img
            src="./images/profile.png"
            alt="profile"
            className="cursor-pointer w-8 h-8"
            onClick={toggleDropdown}
          />
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
              <button
                onClick={goToSettings}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-300 focus:outline-none focus:bg-gray-200"
              >
                Edit Profile
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <div
        className="relative py-8 px-5 rounded-xl mt-10 mx-5"
        style={{
          background: "linear-gradient(330deg, #709D50 0%, #FCFEF2 100%)",
          border: "1px solid #dcdcdc",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
        }}
      >
        <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden z-0">
          <img
            src="./images/bg.png"
            alt="wave background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10">
          <h1 className="text-[32px] font-bold font-roboto">
            Therapy Worksheet & Treatment Planner
          </h1>
        </div>
      </div>
    </main>
  );
};

export default Header;
