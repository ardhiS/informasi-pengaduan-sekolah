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

	return (
		<>
			<input
				type="radio"
				className="btn-check"
				name="category"
				id={category}
				value={category}
				checked={isChecked}
				onChange={onSelectedCategory}
			/>
			<label htmlFor={category} className="btn btn-outline-info radio-card">
				{titleCaseFormatter(category)}
			</label>
		</>
	);
}
