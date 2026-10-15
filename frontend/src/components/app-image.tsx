import Image, { ImageProps } from "next/image";
import { getImageUrl } from "@/lib/image-url";

type AppImageProps = Omit<ImageProps, "src"> & {
    src?: string | null;
};

export default function AppImage({ src, alt, ...props }: AppImageProps) {
    return <Image src={getImageUrl(src)} alt={alt ?? ""} {...props} />;
}
