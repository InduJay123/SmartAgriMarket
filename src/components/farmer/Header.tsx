import { User } from "lucide-react";

interface HeaderProps {
    icon?: React.ElementType
    title?: string;
    subTitle?: string
}

const Header:React.FC <HeaderProps>= ({
    icon: IconComponent,
    title,
    subTitle,
}) => {
    return(
        <div>
            <div className="flex flex-col items-start justify-start gap-4 mb-6">
                <div className="flex flex-wrap gap-6">
                    <User/>
                    <div className="flex flex-col items-start justify-start gap-2">
                        <h1 className="font-extrabold text-3xl"> Welcome back, Neha</h1>                         
                        <p className="text-xs text-gray-400">Here,s what's happening with your farm today</p>
                    </div>
                </div>                    
            </div>

            <div className="flex flex-wrap gap-4 items-start justify-start">
                {IconComponent && <IconComponent  className="text-gray-500"/>}
                <h2  className="text-black font-bold text-2xl">{title}</h2>
            </div>
            <p className="text-xs text-gray-400 text-start mt-2">{subTitle}</p>
        </div>
        
    )
}

export default Header;