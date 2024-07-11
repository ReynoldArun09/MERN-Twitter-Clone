import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  IoNotifications,
  BiLogOut,
  MdHomeFilled,
} from "../../utils/Icons";
import XSvg from "../common/XSvg";
import { LogoutUserApi } from "../../services/auth-api";
import placeholderimg from "../../assets/images/avatar-placeholder.png";

export default function Sidebar() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: logout } = useMutation({
    mutationKey: ["logout-user"],
    mutationFn: LogoutUserApi,
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["verify-user"] });
      navigate("/register");
    },
  });

  const { data: authUser } = useQuery({ queryKey: ["verify-user"] });

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
  };
  const SideBarLinks = [
    {
      name: "Home",
      icon: <MdHomeFilled className="w-6 h-6" />,
      href: "/",
    },
    {
      name: "Notifications",
      icon: <IoNotifications className="w-6 h-6" />,
      href: "/notification",
    },
    {
      name: "Profile",
      icon: <FaUser className="w-6 h-6" />,
      href: `/profile/${authUser?.username}`,
    },
  ];

  return (
    <aside className="md:flex-[2_2_0] w-18 max-w-52">
      <div className="sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-20 md:w-full">
        <Link to="/" className="flex justify-center md:justify-start">
          <XSvg className="px-2 w-12 h-12 rounded-full fill-white hover:bg-stone-900" />
        </Link>
        <ul className="flex flex-col gap-3 mt-4">
          {SideBarLinks.map((links) => (
            <li
              key={links.name}
              className="flex justify-center md:justify-start"
            >
              <Link
                to={links.href}
                className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
              >
                {links.icon}
                <span className="text-lg hidden md:block">{links.name}</span>
              </Link>
            </li>
          ))}
        </ul>
        {authUser && (
          <Link
            to={`/profile/${authUser?.username}`}
            className="mt-auto mb-10 flex gap-2 items-start transition-all duration-300 hover:bg-[#181818] py-2 px-4 rounded-full"
          >
            <div className="avatar hidden md:inline-flex">
              <div className="w-8 rounded-full">
                <img
                  src={authUser?.profileImg || placeholderimg}
                  alt="profile-image"
                />
              </div>
            </div>
            <div className="flex justify-between flex-1">
              <div className="hidden md:block">
                <p className="text-white font-bold text-sm w-20 truncate">
                  {authUser?.fullName}
                </p>
                <p className="text-slate-500 text-sm">@{authUser?.username}</p>
              </div>
              <BiLogOut
                className="w-5 h-5 mt-2 cursor-pointer"
                onClick={handleLogout}
              />
            </div>
          </Link>
        )}
      </div>
    </aside>
  );
}
