import { Alert, Button } from "flowbite-react";
import { Info, RefreshCcw } from "lucide-react";

const ErrorView = ({ onRetry }: { onRetry: () => void }) => {
  return (
    <div className="mx-auto max-w-3xl p-6 md:p-10">
      <Alert color="failure" withBorderAccent icon={() => <Info />}>
        <div className="mb-3">
          <h3 className="font-semibold">Couldn't load booster data</h3>
          <p className="text-sm text-gray-600">Please try again.</p>
        </div>
        <Button color="failure" onClick={onRetry}>
          <span className="inline-flex items-center gap-2">
            <RefreshCcw size={16} /> Retry
          </span>
        </Button>
      </Alert>
    </div>
  );
};

export default ErrorView;
