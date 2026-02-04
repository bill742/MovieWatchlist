import Image from "next/image";
import type { CastAndCrew } from "@/types";

export function CastAndCrewInfo({
  profile_path,
  name,
  id,
  character,
}: CastAndCrew) {
  return (
    <>
      {profile_path ? (
        <Image
          src={`${process.env.NEXT_PUBLIC_API_IMAGE_PATH}w200${profile_path}`}
          alt={name}
          width={128}
          height={192}
          className="mb-2 h-auto w-full rounded-md md:w-32"
        />
      ) : (
        <div className="flex h-48 w-32 items-center justify-center bg-gray-200 text-center">
          <span className="px-4 text-sm text-gray-500">No Image Available</span>
        </div>
      )}

      <p key={id} className="font-medium">
        {name}
      </p>

      {character && (
        <p className="text-muted-foreground text-sm">as {character}</p>
      )}
    </>
  );
}
