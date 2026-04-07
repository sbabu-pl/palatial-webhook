import { QuoteRequestForm } from "../../components/forms/quote-request-form";

export default function MotorInsurancePage() {
  return (
    <main style={{ padding: '50px' }}>
      <h1>Get a Motor Insurance Quote</h1>
      <QuoteRequestForm productType="MOTOR" />
    </main>
  );
}