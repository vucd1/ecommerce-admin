"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";

interface ImageUploadProps {
    disabled?: boolean;
    onChange: (value: string) => void;
    onRemove: (value: string) => void;
    value: string[];  // So we can upload multiple images at once
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    disabled,
    onChange,
    onRemove,
    value
}) => {
    // If a component is "mounted" in React, it means that the component has been rendered into the DOM,
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // He figured result.info.secure_url from console loggin rather than the docs... This is from Cloundinary.
    const onUpload = (result: any) => {
        onChange(result.info.secure_url);
    }

    // If the component is not mounted, it returns null to avoid rendering any client-specific 
    // content during server-side rendering.
    // Make sure this logic is below onUpload.
    if (!isMounted) {
        return null;
    }

    return (
        <div>
            <div className="mb-4 flex items-center gap-4">
                {value.map((url) => (
                    <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
                        <div className="z-10 absolute top-2 right-2">
                            <Button type="button" onClick={() => onRemove(url)} variant="destructive" size="icon">
                                <Trash className="h-4 w-4" />
                            </Button>
                        </div>
                        <Image
                            fill
                            className="object-cover"
                            alt="Image"
                            src={url}
                        />
                    </div>
                ))}
            </div>
            {/* This is the drag/click to upload media pop up */}
            <CldUploadWidget onSuccess={onUpload} uploadPreset="xpinmv1j">
                {({ open }) => {
                    const onClick = () => {
                        open();
                        console.log('value2', value)
                    }
                    return (
                        <Button
                            type="button"
                            disabled={disabled}
                            variant="secondary"
                            onClick={onClick}
                        >
                            <ImagePlus className="h-4 w-4 mr-2" />
                            Upload an Image
                        </Button>
                    )
                }}
            </CldUploadWidget>
        </div>
    )
}

export default ImageUpload;


// BUG FIX: I had to disable uBlock adblocker to get rid of this error message:
// index.html?cloudName…/billboards/new:166 
//  GET https://cdnjs.cloudflare.com/ajax/libs/rollbar.js/2.11.0/rollbar.min.js net::ERR_BLOCKED_BY_CLIENT
// Images are still not showing up after being uploaded though...

// BUG FIX 2: CldUploadWidget's onUpload was DEPRICATED. I needed to find an alt (onSuccess) and I also
// had to add disabled={loading} to billboard-forms.tsx as a prop for ImageUpload.

// BUG FIX 3: Needed to configure next.config.js to be able to use next/image with Cloundinary. UGH.