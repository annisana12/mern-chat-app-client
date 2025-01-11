import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { apiRequest } from "@/lib/api_client";
import { getRandomProfileColor, profileColors } from "@/lib/utils";
import { useAppStore } from "@/store"
import { getCroppedImage } from "@/utils/canvas_utils";
import { SETUP_PROFILE_ROUTE } from "@/utils/constants";
import { setupProfileSchema, validateForm } from "@/utils/validation";
import { AlignRight, Camera, Check, Loader2, RotateCw, Trash2, ZoomIn, ZoomOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Cropper from "react-easy-crop";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Profile = () => {
    const navigate = useNavigate();
    const inputFileRef = useRef(null);

    const userinfo = useAppStore((state) => state.userinfo);
    const setUserInfo = useAppStore((state) => state.setUserInfo);

    const [name, setName] = useState('');
    const [profileColor, setProfileColor] = useState('');
    const [imageSrc, setImageSrc] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null);
    const [blobURL, setBlobURL] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!profileColor) {
            setProfileColor(getRandomProfileColor());
        }
    }, [profileColor])

    const handleClickProfileImage = () => {
        if (croppedImage) {
            setCroppedImage(null);
            setBlobURL(null);
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
            setImageSrc(reader.result);
        }

        reader.readAsDataURL(file);

        inputFileRef.current.value = null;
    }

    const onRotateImage = () => {
        setRotation((rotation + 90) % 360);
    }

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }

    const saveCroppedImage = async () => {
        setLoading(true);

        const blob = await getCroppedImage(imageSrc, croppedAreaPixels, rotation);
        const blobURL = URL.createObjectURL(blob);

        setCroppedImage(blob);
        setBlobURL(blobURL);

        setImageSrc(null);
        setCroppedAreaPixels(null);
        setRotation(0);
        setZoom(1);
        setCrop({ x: 0, y: 0 });

        setLoading(false);
    }

    const saveProfile = async () => {
        setLoading(true);

        const isValid = await validateForm(
            setupProfileSchema,
            { name },
            setErrors
        );

        if (!isValid) return;

        const formData = new FormData();

        formData.append("name", name);
        formData.append("bgColor", profileColor);

        if (croppedImage) {
            const filename = userinfo.id + '.jpg';
            const file = new File([croppedImage], filename, { type: 'image/jpeg' });

            formData.append("profileImage", file);
        }

        const response = await apiRequest(
            'post',
            SETUP_PROFILE_ROUTE,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } },
            10000
        );

        if (response && response.data.data.id) {
            setLoading(false);
            setUserInfo(response.data.data);

            navigate('/chat');
        } else {
            setLoading(false);
        }
    }

    return (
        <div className="h-screen w-screen">
            <div className="border-b border-b-zinc-300 h-[10%] flex items-center px-6 py-5">
                <div className="flex flex-row items-center">
                    <AlignRight size={20} />
                    <div className="ml-1 font-semibold">MERN Chat</div>
                </div>
            </div>

            {
                imageSrc ? (
                    <div className="h-[85%] flex flex-col">
                        <div className="relative flex-grow bg-zinc-700">
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                rotation={rotation}
                                aspect={1}
                                cropShape="round"
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                            />
                        </div>

                        <div className="p-6 flex justify-center">
                            <div className="w-full max-w-xs">
                                <div className="flex justify-between">
                                    <Button
                                        onClick={onRotateImage}
                                        size="icon"
                                        variant="outline"
                                        className="mr-6"
                                    >
                                        <RotateCw />
                                    </Button>

                                    <div className="flex items-center flex-grow space-x-3">
                                        <ZoomOut size={26} />

                                        <Slider
                                            value={[zoom]}
                                            onValueChange={(values) => setZoom(values[0])}
                                            min={1}
                                            max={3}
                                            step={0.1}
                                        />

                                        <ZoomIn size={26} />
                                    </div>
                                </div>

                                <Button
                                    onClick={saveCroppedImage}
                                    className="w-full mt-6"
                                    disabled={loading}
                                >
                                    {loading && <Loader2 className="animate-spin" />}
                                    Set as Profile Picture
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-[80%] flex justify-center items-center">
                        <div className="w-[80%] max-w-sm">
                            <div className="mb-8 md:mb-10 text-center md:text-left">
                                <h2 className="text-3xl font-semibold">Setup Profile</h2>
                            </div>

                            <div className="flex flex-col md:flex-row gap-7 items-center">
                                <div className="relative w-28 md:w-32">
                                    <Avatar className="w-28 h-28 md:w-32 md:h-32">
                                        <AvatarImage src={blobURL} alt="profile-picture" />
                                        <AvatarFallback className={`${profileColor} text-white text-5xl`}>
                                            {name.trim().charAt(0).toUpperCase() || userinfo.email.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>

                                    <Button
                                        onClick={handleClickProfileImage}
                                        className="rounded-full absolute bottom-0 right-0 w-10 h-10"
                                        size="icon"
                                    >
                                        {
                                            blobURL ? <Trash2 /> : <Camera />
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

                                    <div className="flex flex-col gap-2">
                                        <Input
                                            type="text"
                                            id="name"
                                            placeholder="Name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />

                                        {errors.name && <span className="text-xs text-red-500 font-medium">{errors.name}</span>}
                                    </div>

                                    {
                                        !blobURL &&
                                        <div className="grid grid-cols-6 gap-3">
                                            {
                                                profileColors.map((bgColor, index) => (
                                                    <div className="flex justify-center" key={index}>
                                                        <Button
                                                            onClick={() => setProfileColor(bgColor)}
                                                            className={`rounded-full ${bgColor} w-7 h-7 hover:${bgColor} hover:opacity-75`}
                                                            size="icon"
                                                            disabled={profileColor === bgColor}
                                                        >
                                                            {profileColor === bgColor && <Check />}
                                                        </Button>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    }
                                </div>
                            </div>

                            <Button
                                onClick={saveProfile}
                                className="w-full mt-10"
                                disabled={loading}
                            >
                                {loading && <Loader2 className="animate-spin" />}
                                Save Profile
                            </Button>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default Profile