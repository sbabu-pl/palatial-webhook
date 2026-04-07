import { Suspense } from "react";
import { QuoteRequestForm } from "../../components/forms/quote-request-form";

export default function MotorInsurancePage() {
  return (
    <main style={{ padding: '20px' }}>
      <h1>Get a Motor Insurance Quote</h1>
      
      {/* This Suspense boundary fixes the build error */}
      <Suspense fallback={<div>Loading form...</div>}>
        <QuoteRequestForm productType="MOTOR" />
      </Suspense>
      
    </main>
  );
}