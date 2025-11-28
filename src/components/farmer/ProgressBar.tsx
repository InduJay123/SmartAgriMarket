const ProgressBar:React.FC <{ step: number }>= ({ step }) => {

    const steps = [
        "1. Choose Crop",
        "2. Details",
        "3. Pricing",
        "4. Location & Photo"
    ];

    return(
        <div className="bg-white border rounded-xl shadow-md px-6 py-2 w-full mb-6">
            <div className="flex flex-wrap mt-4 mb-2 justify-between">
                {steps.map((label, index) => {
                    const current = index+1;
                    return(
                        <span key={index} className={`text-xs ${step >= current ? "text-green-700" : "text-gray-500"}`}>
                            {label}
                        </span>
                    )
                })}
            </div>

            <div className="flex mt-2 mb-2 bg-yellow-500 rounded-full">
                {steps.map((_,index) => {
                    const current = index+1;
                    return(
                        <div key={index} className={`flex-1 h-2 rounded-l-full transition-all duration-300 ${step >= current ? "bg-green-700" : ""}`}>

                        </div>
                    )
                })}
            </div>

            
        </div>
    )
}

export default ProgressBar;