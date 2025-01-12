export default function Work({
  name,
  role,
  time,
  href,
  children,
}: {
  name: string;
  role: string;
  time: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      rel="noopener noreferrer"
      target="_blank"
      href={href}
      className="bg-surface flex h-36 w-48 flex-col rounded-md px-2 py-1.5"
    >
      <div
        role="img"
        aria-label={`${name} logo`}
        className="grid flex-grow place-items-center"
      >
        {children}
      </div>
      <div className="flex items-center justify-between">
        <span>
          {role} / {time}
        </span>
        <svg
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="size-4"
        >
          <path
            d="M12.375 4V10.5C12.375 10.5995 12.3355 10.6948 12.2652 10.7652C12.1948 10.8355 12.0994 10.875 12 10.875C11.9005 10.875 11.8051 10.8355 11.7348 10.7652C11.6645 10.6948 11.625 10.5995 11.625 10.5V4.905L4.26498 12.265C4.1939 12.3312 4.09987 12.3673 4.00272 12.3656C3.90557 12.3639 3.81288 12.3245 3.74417 12.2558C3.67547 12.1871 3.63611 12.0944 3.6344 11.9973C3.63268 11.9001 3.66874 11.8061 3.73498 11.735L11.095 4.375H5.49998C5.40053 4.375 5.30515 4.33549 5.23482 4.26516C5.16449 4.19484 5.12498 4.09946 5.12498 4C5.12498 3.90054 5.16449 3.80516 5.23482 3.73483C5.30515 3.66451 5.40053 3.625 5.49998 3.625H12C12.0994 3.625 12.1948 3.66451 12.2652 3.73483C12.3355 3.80516 12.375 3.90054 12.375 4Z"
            fill="#423F3C"
          />
        </svg>
      </div>
    </a>
  );
}
