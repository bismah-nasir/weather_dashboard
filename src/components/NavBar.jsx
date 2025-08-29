import { TbCloudPin } from "react-icons/tb";
const NavBar = () => {
    return (
        <div className="flex justify-center items-center mb-8">
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                <div className="w-10 h-10 flex items-center justify-center">
                    <TbCloudPin size={40} />
                </div>
                Weather Dashboard
            </h1>
        </div>
    );
};

export default NavBar;
