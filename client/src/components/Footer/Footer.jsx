// import React from "react";
// import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

// const Footer = () => {
//   return (
//     <div className="ml-2 tertiary_bg px-8 py-16 mb-20">
//       <div className="grid grid-cols-12 ">
//         <div className="col-span-3 text-sm">
//           <ul>
//             <li className="font-bold mb-4">Company</li>
//             <li className="text-gray-400 my-2 hover:text-white hover:underline cursor-pointer">About</li>
//             <li className="text-gray-400 my-2">Jobs</li>
//             <li className="text-gray-400 my-2">For the Record</li>
//           </ul>
//         </div>
//         <div className="col-span-3">
//           <ul>
//             <li className="font-bold">Communities</li>
//             <li className="text-gray-400 my-2">For Artists</li>
//             <li className="text-gray-400 my-2">Developers</li>
//             <li className="text-gray-400 my-2">Advertising</li>
//             <li className="text-gray-400 my-2">Investors</li>
//             <li className="text-gray-400 my-2">Vendors</li>
//           </ul>
//         </div>
//         <div className="col-span-3">
//           <ul>
//             <li className="font-bold">Useful links</li>
//             <li className="text-gray-400 my-2">Support</li>
//             <li className="text-gray-400 my-2">Free Mobile App</li>
//           </ul>
//         </div>
//         <div className="col-span-3">
//           <div className="flex justify-end gap-2">
//             <FaFacebook className="text-4xl p-2 rounded-full bg-[#292929] shadow-2xl hover:bg-white/10" />
//             <FaInstagram className="text-4xl p-2 rounded-full bg-[#292929] shadow-2xl hover:bg-white/10" />
//             <FaTwitter className="text-4xl p-2 rounded-full bg-[#292929] shadow-2xl hover:bg-white/10" />
//           </div>
//         </div>
//       </div>
//       <div className="border-b border-white/10 my-8 w-full"></div>
//       <div className="flex justify-between">
//         <ul className="text-sm flex gap-4">
//           <li className="text-gray-400">Legal</li>
//           <li className="text-gray-400">Privacy Center</li>
//           <li className="text-gray-400">Privacy Policy</li>
//           <li className="text-gray-400">Cookies</li>
//           <li className="text-gray-400">About Ads</li>
//           <li className="text-gray-400">Accessibility</li>
//         </ul>
//         <h4 className="text-gray-400 text-sm">© RhythmNest </h4>
//       </div>
//     </div>
//   );
// };

// export default Footer;
import React from "react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white-800 text-red-500 ml-2 px-8 py-16 mb-20">
      <div className="container mx-auto px-6 text-center">
        <h4 className="text-lg font-semibold mb-4">Connect with Us</h4>
        <div className="flex justify-center space-x-6 mb-4">
          <FaFacebook className="text-2xl hover:text-white cursor-pointer" />
          <FaInstagram className="text-2xl hover:text-white cursor-pointer" />
          <FaTwitter className="text-2xl hover:text-white cursor-pointer" />
        </div>
        <div className="flex justify-center space-x-8 text-sm mb-4 gap-4">
          <a href="#" className="hover:underline hover:text-white">About</a>
          <a href="#" className="hover:underline hover:text-white">Jobs</a>
          <a href="#" className="hover:underline hover:text-white">Support</a>
          <a href="#" className="hover:underline hover:text-white">Privacy Policy</a>
        </div>
        <p className="text-xs text-red-300 ">
          &copy; {new Date().getFullYear()} RhythmNest. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
