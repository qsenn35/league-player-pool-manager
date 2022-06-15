import { useContext, useEffect, useRef, useState } from "react";
import { Form, Input, Select } from "antd";
import { EditableContext } from "../../contexts";

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  isSelect,
  selectOptions,
  ...restProps
}) => {
  const formContext = useContext(EditableContext);
  const inputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (isEditing && !isSelect) {
      inputRef.current.focus();
    }
  }, [isEditing, isSelect]);

  const toggleEditing = () => {
    setIsEditing(!isEditing);
    formContext.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const handleClick = () => toggleEditing();

  const save = async () => {
    console.log("saving..")
    try {
      const values = await formContext.validateFields();
      toggleEditing();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  const createChildNode = () => {
    if (isEditing) {
      if (isSelect) {
        return (
          <Form.Item
            style={{ margin: 0 }}
            name={dataIndex}
            rules={[{ required: true, message: `${title} is required.` }]}
          >
            <Select onChange={save}>
              {selectOptions.map((option) => {
                return <Select.Option value={option.value} >
                  {option.label}
                </Select.Option>;
              })}
            </Select>
          </Form.Item>
        );
      } else {
        return (
          <Form.Item
            style={{ margin: 0 }}
            name={dataIndex}
            rules={[{ required: true, message: `${title} is required.` }]}
          >
            <Input ref={inputRef} onPressEnter={save} onBlur={save} />
          </Form.Item>
        );
      }
    } else if (dataIndex !== "operation") {
      return <div onDoubleClick={handleClick}>{children}</div>;
    } else {
      return <div>{children}</div>
    }
  };

  const childNode = createChildNode();

  return <td {...restProps}>{childNode}</td>;
};

export default EditableCell;
