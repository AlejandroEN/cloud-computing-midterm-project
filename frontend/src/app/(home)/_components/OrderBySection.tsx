import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const options: {
  id: string;
  label: string;
}[] = [
  { label: "Fecha de publicación: más recientes", id: "creationDate-desc" },
  { label: "Fecha de publicación más antiguas", id: "creationDate-asc" },
  { label: "Título: A-Z", id: "title-asc" },
  { label: "Título: Z-A", id: "title-desc" },
  { label: "Precio: más baratos primero", id: "price-asc" },
  { label: "Precio: más caros primero", id: "price-desc" },
];

export default function OrderBySection() {
  return (
    <RadioGroup defaultValue="comfortable">
      {options.map((option, index) => (
        <div key={index} className="flex items-center space-x-2">
          <RadioGroupItem value={option.id} id={option.id} />
          <Label htmlFor={option.id}>{option.label}</Label>
        </div>
      ))}
    </RadioGroup>
  );
}
