import React from "react";
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";

export const PostSkeleton: React.FC = () => {
    return (
        <div className="bg-white border border-gray-300 rounded-md overflow-hidden mb-4 p-4">
            <Stack spacing={1}>
                <Skeleton variant="rectangular" width="100%" height={300} />
                <div className="mt-4">
                    <div className="flex items-center mb-3">
                        <Skeleton variant="circular" width={40} height={40} className="mr-3" />
                        <div>
                            <Skeleton variant="text" width={60} height={20} />
                            <Skeleton variant="text" width={100} height={15} />
                        </div>
                    </div>
                    <div className="mb-4">
                        <Skeleton variant="text" width="80%" height={45} />
                        <div className="flex space-x-4 mt-3">
                            <Skeleton variant="text" width={40} height={30} />
                            <Skeleton variant="text" width={40} height={30} />
                            <Skeleton variant="text" width={40} height={30} />
                        </div>
                    </div>
                </div>
            </Stack>
        </div>
    );
};
