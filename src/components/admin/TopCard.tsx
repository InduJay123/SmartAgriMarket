interface TopCardProps {
    title: string;
    description: string;
    bottomText?: string;
    icon: React.ElementType;
    iconBgColor: string;
    iconColor: string;
}

const TopCard:React.FC<TopCardProps> = ({
    title,
    description,
    bottomText,
    icon: IconComponent,
    iconBgColor,
    iconColor,
}) => {
    return(
        <div className="min-w-[200px] max-w-[250px] flex-1 bg-white border border-gray-100 shadow-md rounded-lg p-4">
            <div className="flex items-start justify-between">
                <div className="flex flex-col items-start justify-start">
                    <p className="text-gray-500 text-xs ">{title}</p>
                    <h3 className="font-bold text-2xl">{description}</h3>
                    <p className="text-gray-500 text-xs">{bottomText}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl ${iconBgColor} p-2`}>
                     <IconComponent className={`${iconColor}`}/>
                </div>
            </div>
        </div>
    )
}

export default TopCard;