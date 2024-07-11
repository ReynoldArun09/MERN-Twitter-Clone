import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  DeleteAllNotificationsApi,
  GetAllNotificationsApi,
} from "../../services/notification-api";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import placeholderImg from "../../assets/images/avatar-placeholder.png";
import { Link } from "react-router-dom";
import {FaUser, FaHeart, IoSettingsOutline} from '../../utils/Icons'

export default function NotificationPage() {
  const queryClient = useQueryClient();
  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: GetAllNotificationsApi,
  });

  const { mutate: deleteNotifications } = useMutation({
    mutationKey: ["delete-notification"],
    mutationFn: DeleteAllNotificationsApi,
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
  return (
    <>
      <div className="flex-[4_4_0] border-l border-r border-gray-700 min-h-screen">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <p className="font-bold">Notifications</p>
          <div className="dropdown ">
            <div tabIndex={0} role="button" className="m-1">
              <IoSettingsOutline className="w-4" />
            </div>
            <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
              <li>
                <button type="button" onClick={deleteNotifications}>
                  Delete all notifications
                </button>
              </li>
            </ul>
          </div>
        </div>
        {isLoading && (
          <div className="flex justify-center h-full items-center">
            <LoadingSpinner size="lg" />
          </div>
        )}
        {notifications?.length === 0 && (
          <div className="text-center p-4 font-bold">No notifications 🤔</div>
        )}
        {notifications?.map((notification) => (
          <div className="border-b border-gray-700" key={notification._id}>
            <div className="flex gap-2 p-4">
              {notification.type === "follow" && (
                <FaUser className="w-7 h-7 text-primary" />
              )}
              {notification.type === "like" && (
                <FaHeart className="w-7 h-7 text-red-500" />
              )}
              <Link to={`/profile/${notification.from.username}`}>
                <div className="avatar">
                  <div className="w-8 rounded-full">
                    <img
                      src={notification.from.profileImg || placeholderImg}
                      alt="profile-img"
                    />
                  </div>
                </div>
                <div className="flex gap-1">
                  <span className="font-bold">
                    @{notification.from.username}
                  </span>{" "}
                  {notification.type === "follow"
                    ? "followed you"
                    : "liked your post"}
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
