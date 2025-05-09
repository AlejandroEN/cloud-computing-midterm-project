"use client";

import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function FilterSection() {
	const [minValue, setMinValue] = useState(0);
	const [maxValue, setMaxValue] = useState(100);
	const params = useSearchParams();

	return (
		<div className="flex flex-row gap-2 items-center">
			<Input placeholder="Mín." />
			a
			<Input placeholder="Max." />
		</div>
	);
}
