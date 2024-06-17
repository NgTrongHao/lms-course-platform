import Image from "next/image";
import Link from "next/link";

const Logo = () => {
    return (
        <Link href="/">
            <Image height={60} width={60} alt="Cursus Logo" src="/cursus-logo.svg" priority />
        </Link>
    );
}

export default Logo;