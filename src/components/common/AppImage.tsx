import { Image, ImageProps } from "react-native";

type AppImageProps = ImageProps & {
  className?: string;
};

export function AppImage({ className, ...props }: AppImageProps) {
  return <Image {...props} className={className} />;
}
