import { FallbackProps } from "react-error-boundary";

export function ErrorDisplay({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div
      className={
        "pl:flex pl:h-full pl:w-full pl:flex-col pl:items-center pl:justify-center pl:text-center"
      }
    >
      <h1 className={"pl:text-xl"}>Something went wrong...</h1>
      <p>{Error.isError(error) ? error.message : error}</p>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}
