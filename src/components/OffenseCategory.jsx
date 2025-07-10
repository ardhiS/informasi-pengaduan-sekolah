import React from "react";

export default function OffenseCategory({
	category,
	isChecked,
	onSelectedCategory,
}) {
	function titleCaseFormatter(str) {
		return str
			.replace(/-/g, " ")
			.split(" ")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
			.join(" ");
	}
	function getCategoryClass(category) {
		switch (category) {
			case "merokok":
				return "danger";
			case "perpeloncoan":
				return "dark";
			case "intimidasi":
				return "secondary";
			case "merusak-fasilitas-sekolah":
				return "danger";
			case "bolos":
				return "secondary";
		}
	}
	return (
		<>
			<input
				type="radio"
				className={"btn-check"}
				name="category"
				id={category}
				value={category}
				checked={isChecked}
				onChange={onSelectedCategory}
			/>
			<label
				htmlFor={category}
				className={`btn btn-outline-${getCategoryClass(category)} radio-card`}>
				{titleCaseFormatter(category)}
			</label>
		</>
	);
}
