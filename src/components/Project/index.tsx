import Image from "next/image";

import type { EventData } from "../Timeline/timeline";

export default function Project({
  title,
  thumbnail,
  github,
  website,
  x,
  y,
}: EventData & {
  x: number;
  y: number;
}) {
  return (
    <div
      style={{
        left: x,
        top: y,
      }}
      className="bg-surface h-45 absolute flex w-60 flex-col rounded-md p-1 pb-0"
    >
      <Image
        src={`/thumbnails/${thumbnail}`}
        alt={`${title} thumbnail`}
        width={466}
        height={298}
        className="w-full flex-grow rounded object-cover shadow-md"
      />
      <div className="flex w-full items-center p-1">
        <span>{title}</span>
        {(github || website) && (
          <div className="ml-auto">
            {website ? (
              <svg
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
                className="size-4"
              >
                <path d="M12.375 4V10.5C12.375 10.5995 12.3355 10.6948 12.2652 10.7652C12.1948 10.8355 12.0994 10.875 12 10.875C11.9005 10.875 11.8051 10.8355 11.7348 10.7652C11.6645 10.6948 11.625 10.5995 11.625 10.5V4.905L4.26498 12.265C4.1939 12.3312 4.09987 12.3673 4.00272 12.3656C3.90557 12.3639 3.81288 12.3245 3.74417 12.2558C3.67547 12.1871 3.63611 12.0944 3.6344 11.9973C3.63268 11.9001 3.66874 11.8061 3.73498 11.735L11.095 4.375H5.49998C5.40053 4.375 5.30515 4.33549 5.23482 4.26516C5.16449 4.19484 5.12498 4.09946 5.12498 4C5.12498 3.90054 5.16449 3.80516 5.23482 3.73483C5.30515 3.66451 5.40053 3.625 5.49998 3.625H12C12.0994 3.625 12.1948 3.66451 12.2652 3.73483C12.3355 3.80516 12.375 3.90054 12.375 4Z" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 16 17"
                xmlns="http://www.w3.org/2000/svg"
                className="size-4"
              >
                <path d="M7.99998 1.83331C7.1245 1.83331 6.25759 2.00575 5.44876 2.34078C4.63992 2.67581 3.90499 3.16688 3.28593 3.78593C2.03569 5.03618 1.33331 6.73187 1.33331 8.49998C1.33331 11.4466 3.24665 13.9466 5.89331 14.8333C6.22665 14.8866 6.33331 14.68 6.33331 14.5V13.3733C4.48665 13.7733 4.09331 12.48 4.09331 12.48C3.78665 11.7066 3.35331 11.5 3.35331 11.5C2.74665 11.0866 3.39998 11.1 3.39998 11.1C4.06665 11.1466 4.41998 11.7866 4.41998 11.7866C4.99998 12.8 5.97998 12.5 6.35998 12.34C6.41998 11.9066 6.59331 11.6133 6.77998 11.4466C5.29998 11.28 3.74665 10.7066 3.74665 8.16665C3.74665 7.42665 3.99998 6.83331 4.43331 6.35998C4.36665 6.19331 4.13331 5.49998 4.49998 4.59998C4.49998 4.59998 5.05998 4.41998 6.33331 5.27998C6.85998 5.13331 7.43331 5.05998 7.99998 5.05998C8.56665 5.05998 9.13998 5.13331 9.66665 5.27998C10.94 4.41998 11.5 4.59998 11.5 4.59998C11.8666 5.49998 11.6333 6.19331 11.5666 6.35998C12 6.83331 12.2533 7.42665 12.2533 8.16665C12.2533 10.7133 10.6933 11.2733 9.20665 11.44C9.44665 11.6466 9.66665 12.0533 9.66665 12.6733V14.5C9.66665 14.68 9.77331 14.8933 10.1133 14.8333C12.76 13.94 14.6666 11.4466 14.6666 8.49998C14.6666 7.6245 14.4942 6.75759 14.1592 5.94876C13.8241 5.13992 13.3331 4.40499 12.714 3.78593C12.095 3.16688 11.36 2.67581 10.5512 2.34078C9.74237 2.00575 8.87546 1.83331 7.99998 1.83331Z" />
              </svg>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
