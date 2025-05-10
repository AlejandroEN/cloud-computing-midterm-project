import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const options: {
	label: string;
	query: string;
}[] = [
	{ label: "Fecha de publicación: más recientes", query: "" },
	{ label: "Fecha de publicación más antiguas", query: "" },
	{ label: "Compact", query: "compact" },
];

export default function OrderBySection() {
	return (
		<RadioGroup defaultValue="comfortable">
			<div className="flex items-center space-x-2">
				<RadioGroupItem value="default" id="r1" />
				<Label htmlFor="r1">Fecha de publicación: más recientes</Label>
			</div>
			<div className="flex items-center space-x-2">
				<RadioGroupItem value="comfortable" id="r2" />
				<Label htmlFor="r2">Fecha de publicación más antiguas</Label>
			</div>
			<div className="flex items-center space-x-2">
				<RadioGroupItem value="compact" id="r3" />
				<Label htmlFor="r3">Compact</Label>
			</div>
		</RadioGroup>
	);
}
