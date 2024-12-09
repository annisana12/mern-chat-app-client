import { useAppStore } from "@/store"

const Profile = () => {
    const userinfo = useAppStore((state) => state.userinfo);

    return (
        <div>
            Profile
            <div>{userinfo ? userinfo.email : ''}</div>
        </div>
    )
}

export default Profile