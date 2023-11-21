import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Container from "react-bootstrap/Container";
import TextField from "@mui/material/TextField";
import { Formik, Field, Form } from "formik";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Select, Space } from "antd";
import { Button } from "antd";

const options = [];
for (let i = 10; i < 36; i++) {
	options.push({
		label: i.toString(36) + i,
		value: i.toString(36) + i,
	});
}

const handleChange = (value) => {
	console.log(`selected ${value}`);
};

// DraggableField component for each draggable form field
const DraggableField = ({ fieldId, children }) => {
	const [, drag] = useDrag({
		type: "FIELD",
		item: { id: fieldId },
	});

	return (
		<div className="draggable-field" ref={drag}>
			{children}
		</div>
	);
};

// DroppedField component for each dropped field in the droppable area
const DroppedField = ({ fieldId }) => {
	if (fieldId === "text") {
		return (
			<Field
				className="dropped-field"
				type="text"
				name="text"
				label="Text Field"
				placeholder="Text Field"
				id={fieldId}
			/>
		);
	} else if (fieldId === "textarea") {
		return (
			<Field
				className="dropped-field"
				as="textarea"
				name="textarea"
				label="Text Area"
				placeholder="Text Area"
				id={fieldId}
			/>
		);
	} else if (fieldId === "dropdown") {
		return (
			<Field as="select" name="dropdown" label="Dropdown" id={fieldId}>
				<option value="">Select an option</option>
				<option value="option1">Option 1</option>
				<option value="option2">Option 2</option>
			</Field>
		);
	} else if (fieldId === "firstName") {
		return (
			<Field name="firstName">
				{({ field, form, meta }) => (
					<div>
						<TextField
							{...field}
							id="filled-basic"
							label="First Name"
							variant="filled"
							fullWidth
						/>
						{/* <input type="text" {...field} placeholder="First Name" /> */}
						{meta.touched && meta.error && (
							<div className="error">{meta.error}</div>
						)}
					</div>
				)}
			</Field>
		);
	} else if (fieldId === "Ant-Design-Simple-Button") {
		return (
			<Field name="antD-Button">
				{({ field, form, meta }) => (
					<div>
						<Button type="primary">Button</Button>
					</div>
				)}
			</Field>
		);
	} else if (fieldId === "select-ant-design") {
		return (
			<Field name="select-ant-design">
				{({ field, form, meta }) => (
					<div>
						<Space
							style={{
								width: "100%",
							}}
							direction="vertical"
						>
							<Select
								mode="multiple"
								allowClear
								style={{
									width: "100%",
								}}
								placeholder="Please select"
								defaultValue={["a10", "c12"]}
								onChange={handleChange}
								options={options}
							/>
							<Select
								mode="multiple"
								disabled
								style={{
									width: "100%",
								}}
								placeholder="Please select"
								defaultValue={["a10", "c12"]}
								onChange={handleChange}
								options={options}
							/>
						</Space>
					</div>
				)}
			</Field>
		);
	} else if (fieldId === "radio-button") {
	} else {
		return <div className="dropped-field">{fieldId}</div>;
	}
};

let items = [];
// DroppableArea component where fields can be dropped
const DroppableArea = ({ droppedFields, onDropField }) => {
	const [, drop] = useDrop({
		accept: "FIELD",
		drop: (item) => {
			// Handle the drop event
			onDropField(item.id);
			console.log(item);
			items.push(item);
		},
	});

	let droppedArea;
	if (droppedFields.length) {
		droppedArea = droppedFields.map((fieldId) => (
			<DroppedField key={fieldId} fieldId={fieldId} />
		));
	} else {
		droppedArea = <p>Drop your fields here</p>;
	}
	return (
		<div className="droppable-area" ref={drop}>
			{droppedArea}
		</div>
	);
};

// DraggableForm component to wrap draggable fields and droppable area
const DraggableFormBuilder = (submitSchema) => {
	const [droppedFields, setDroppedFields] = useState([]);

	const handleDropField = (fieldId) => {
		// Update the state with the dropped field
		setDroppedFields((prevFields) => [...prevFields, fieldId]);
	};

	return (
		<DndProvider backend={HTML5Backend}>
			<Container fluid>
				<Row sm={12} style={{ width: "1920px", height: "800px" }}>
					{/* 60% width for droppable area */}
					<Col xs={8} className="droppable-container">
						<DroppableArea
							droppedFields={droppedFields}
							onDropField={handleDropField}
						/>
					</Col>
					{}
					{/* 40% width for draggable fields */}
					<Col xs={4} className="draggable-fields ">
						{/* Draggable fields */}
						<DraggableField fieldId="text">
							<p>Text Field</p>
						</DraggableField>
						<DraggableField fieldId="textarea">
							<p>Text Area</p>
						</DraggableField>
						<DraggableField fieldId="dropdown">
							<p>Dropdown</p>
						</DraggableField>
						<DraggableField fieldId="firstName">
							<p>Material UI Field</p>
						</DraggableField>
						<DraggableField fieldId="Ant-Design-Simple-Button">
							<p>Ant Design Button</p>
						</DraggableField>
						<DraggableField fieldId="select-ant-design">
							<p>Ant Design Select</p>
						</DraggableField>
						{/* Add more draggable fields here */}
					</Col>
				</Row>
			</Container>
		</DndProvider>
	);
};

// Main Formik form using the draggable form builder
const DragDropFormBuilder = () => {
	const [submitSchemaStatus, setSubmitSchemaStatus] = useState(false);
	return (
		<Formik
			initialValues={
				{
					/* Your initial form values */
				}
			}
			onSubmit={(values) => {
				// Handle form submission
				console.log(values);
				console.log(items);
				setSubmitSchemaStatus(true);
			}}
		>
			<Form>
				{/* Draggable form builder */}
				<DraggableFormBuilder submitSchema={submitSchemaStatus} />

				{/* Submit button */}
				<button type="submit">Submit</button>
			</Form>
		</Formik>
	);
};

export default DragDropFormBuilder;
