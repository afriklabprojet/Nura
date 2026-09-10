import { Button, Heading } from "@modules/common/components/ui";
import LocalizedClientLink from "@modules/common/components/localized-client-link";

const Hero = () => {
  return (
    <div className="h-[75vh] w-full border-b border-nude relative bg-bg overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-brown/10 via-transparent to-brown/20" />
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center small:p-32 gap-6 px-6">
        <span className="uppercase tracking-[0.3em] text-xs text-gold">
          Parfumerie &amp; bodycare premium
        </span>
        <Heading level="h1" className="text-5xl small:text-6xl leading-tight">
          Votre aura commence ici.
        </Heading>
        <Heading
          level="h2"
          className="!font-sans !text-brown/70 text-base font-normal tracking-wide normal-case max-w-md"
        >
          Nura imagine des parfums et des soins pensés pour accompagner
          chaque aura, chaque humeur et chaque moment.
        </Heading>
        <LocalizedClientLink href="/store">
          <Button variant="primary" size="large">
            Découvrir la collection
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  );
};

export default Hero;
