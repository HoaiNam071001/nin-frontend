import Link from "next/link";
// import DarkModeSwitcher from "./DarkModeSwitcher";
// import DropdownMessage from "./DropdownMessage";
// import DropdownNotification from "./DropdownNotification";
// import DropdownUser from "./DropdownUser";
import DropdownUser from "./DropdownUser";
import SystemSearch from "./SystemSearch";
import { Category } from "./Category";
import CustomImage from "../_commons/CustomImage";
import useAuth from "@/hooks/useAuth";
import NButton from "../_commons/NButton";
import { useRouter } from "next/navigation";
import SvgIcon from "../_commons/SvgIcon";
import { ROUTES } from "@/constants";

const Header = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 shadow-default">
      <div className="flex flex-grow items-center justify-between px-4 py-2 container mx-auto">
        <div className="flex items-center gap-2">
          <Link href={ROUTES.HOME} className="cursor-pointer">
            <CustomImage
              src={"/images/logo-full.png"}
              alt={"logo"}
            ></CustomImage>
          </Link>
          <Category></Category>
        </div>

        <div className="mx-auto flex-1 px-3 max-w-[600px]">
          <SystemSearch></SystemSearch>
        </div>

        <div className="flex items-center gap-3 ml-7">
          {isAuthenticated && currentUser ? (
            <div className="gap-8 flex items-center">              
              <SvgIcon icon="bell" className="icon icon-md text-black" />
              <SvgIcon icon="cart" className="icon icon-md text-black" />
              <DropdownUser user={currentUser} />
            </div>
          ) : (
            <>
              <NButton
                variant="primary-outline"
                onClick={() => router.push(ROUTES.SIGN_IN)}
              >
                <span>Sign In</span>
              </NButton>
              <NButton variant="primary" onClick={() => router.push(ROUTES.SIGN_UP)}>
                <span>Sign Up</span>
              </NButton>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
