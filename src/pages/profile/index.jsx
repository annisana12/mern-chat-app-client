import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getRandomProfileColor, profileColors } from "@/lib/utils";
import { useAppStore } from "@/store"
import { AlignRight, Camera, Check, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const Profile = () => {
    const userinfo = useAppStore((state) => state.userinfo);
    const inputFileRef = useRef(null);

    const [name, setName] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [profileColor, setProfileColor] = useState('');

    useEffect(() => {
        if (!profileColor) {
            setProfileColor(getRandomProfileColor());
        }
    }, [profileColor])

    const handleClickProfileImage = () => {
        if (image) {
            setImage(null);
            setImagePreview(null);
        } else {
            inputFileRef.current.click();
        }
    }

    const handleChangeFileInput = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        const allowedTypes = ["image/png", "image/jpeg"];

        if (!allowedTypes.includes(file.type)) {
            toast.error("Invalid file type", {
                description: "Please upload a .png, .jpg, or .jpeg image",
                duration: 10000
            });

            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            setImage(file);
            setImagePreview(reader.result);
        }

        reader.readAsDataURL(file);

        inputFileRef.current.value = null;
    }

    return (
        <div className="h-screen w-screen">
            <div className="border-b border-b-zinc-300 h-[10%] flex items-center px-6 py-5">
                <div className="flex flex-row items-center">
                    <AlignRight size={20} />
                    <div className="ml-1 font-semibold">MERN Chat</div>
                </div>
            </div>

            <div className="h-[80%] flex justify-center items-center">
                <div className="w-[80%] max-w-sm">
                    <div className="mb-8 md:mb-10 text-center md:text-left">
                        <h2 className="text-3xl font-semibold">Setup Profile</h2>
                    </div>

                    <div className="flex flex-col md:flex-row gap-7 items-center">
                        <div className="relative w-28 md:w-32">
                            <Avatar className="w-28 h-28 md:w-32 md:h-32">
                                <AvatarImage src={imagePreview} alt="profile-picture" />
                                <AvatarFallback className={`bg-${profileColor} text-white text-5xl`}>
                                    {name.trim().charAt(0).toUpperCase() || userinfo.email.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>

                            <Button
                                onClick={handleClickProfileImage}
                                className="rounded-full absolute bottom-0 right-0 w-10 h-10"
                                size="icon"
                            >
                                {
                                    image ? <Trash2 /> : <Camera />
                                }
                            </Button>
                        </div>

                        <input
                            ref={inputFileRef}
                            onChange={handleChangeFileInput}
                            type="file"
                            className="hidden"
                            accept="image/png, image/jpeg"
                        />

                        <div className="flex flex-col gap-6 w-full">
                            <Input
                                type="text"
                                id="email"
                                defaultValue={userinfo.email}
                                readOnly
                            />

                            <Input
                                type="text"
                                id="name"
                                placeholder="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />

                            {
                                !image &&
                                <div className="grid grid-cols-6 gap-3">
                                    {
                                        profileColors.map((color, index) => (
                                            <div className="flex justify-center" key={index}>
                                                <Button
                                                    onClick={() => setProfileColor(color)}
                                                    className={`rounded-full bg-${color} w-7 h-7 hover:bg-${color} hover:opacity-75`}
                                                    size="icon"
                                                    disabled={profileColor === color}
                                                >
                                                    {profileColor === color && <Check />}
                                                </Button>
                                            </div>
                                        ))
                                    }
                                </div>
                            }
                        </div>
                    </div>

                    <Button className="w-full mt-10">Save Profile</Button>
                </div>
            </div>
        </div>
    )
}

export default Profile