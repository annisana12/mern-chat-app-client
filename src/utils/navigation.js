import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

let navigate;

export const NavigationSetter = () => {
    const nav = useNavigate();

    useEffect(() => {
        navigate = nav;
    }, [nav]);

    return null;
}

export const getNavigate = () => navigate;