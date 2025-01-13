import Timeline from "@/components/Timeline";
import Work from "@/components/Work/Index";
import Loader from "@/components/Loader";

export default function Home() {
  return (
    <div className="size-full">
      <Loader />
      <Timeline />
      <main className="flex size-full flex-col items-center justify-center gap-6 lg:ml-12 xl:ml-0">
        <h1 className="text-center text-6xl sm:text-8xl/[125px]">
          Michael Beck
        </h1>
        <div className="flex flex-wrap justify-center gap-4 px-12 sm:gap-8">
          <Work
            name="vars"
            href="https://vars.gg"
            role="Co-founder"
            time="Present"
          >
            <svg
              viewBox="0 0 48 40"
              xmlns="http://www.w3.org/2000/svg"
              className="h-10"
            >
              <path d="M12.5929 0H0.585388V39.5362H21.5986L35.4071 25.7584L47.4147 13.7778V0H35.4071V8.38646L16.1951 27.5555H12.5929V0Z" />
              <path d="M47.4147 25.7584H35.4072V39.5362H47.4147V25.7584Z" />
            </svg>
          </Work>
          <Work
            name="Codin"
            href="https://codin.app"
            role="Engineer"
            time="2024"
          >
            <svg
              viewBox="0 0 40 40"
              xmlns="http://www.w3.org/2000/svg"
              className="h-10"
            >
              <path d="M40 20C40 31.0457 31.0457 40 20 40C8.95431 40 0 31.0457 0 20C0 8.95432 8.95431 0 20 0C21.7265 0 23.4019 0.218765 25 0.630088L22.5 11.6123C21.7079 11.3766 20.8687 11.25 20 11.25C15.1675 11.25 11.25 15.1675 11.25 20C11.25 24.8325 15.1675 28.75 20 28.75C24.8325 28.75 28.75 24.8325 28.75 20C28.75 17.9562 28.0493 16.0761 26.875 14.5867L35.0913 6.875C38.1487 10.3875 40 14.9775 40 20Z" />
            </svg>
          </Work>
          <Work
            name="Launch"
            href="https://launchsite.tech"
            role="Founder"
            time="2024"
          >
            <svg
              viewBox="0 0 36 40"
              xmlns="http://www.w3.org/2000/svg"
              className="h-10"
            >
              <path d="M32.1483 39.5034C34.6056 36.3838 35.94 32.5371 35.9391 28.5756C35.9365 25.6096 34.3044 21.8353 32.0255 18.0095C31.5549 17.2195 31.0567 16.4273 30.5396 15.6395C30.4038 15.4328 30.2668 15.2263 30.1286 15.0203C24.8848 7.20179 17.988 0 17.988 0C17.988 0 9.89991 8.44633 4.58909 16.9748C4.34896 17.3604 4.1145 17.7462 3.88673 18.1314C1.65046 21.9132 0.0583334 25.6366 0.0609278 28.5699C0.0557899 32.536 1.39612 36.3895 3.86597 39.5095C4.66941 40.4617 6.26675 39.9185 6.23879 38.6864L6.23879 38.2711C6.23878 34.1867 8.62256 31.3402 9.0333 30.878C11.494 28.1087 14.8646 27.0354 17.988 27.0143C18.9375 27.0208 19.9099 27.1244 20.8726 27.3434C21.7144 27.5348 22.5488 27.8145 23.3542 28.1944C24.6573 28.8093 25.8842 29.6867 26.9428 30.878C27.3535 31.3402 29.7373 34.1867 29.7373 38.2711L29.7754 38.6803C29.7754 39.9607 31.3448 40.4555 32.1483 39.5034Z" />
            </svg>
          </Work>
        </div>
      </main>
    </div>
  );
}
