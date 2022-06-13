import { EditableCell, EditableRow } from '../../components';
import { Table, Form } from 'antd';


const tableComponents = {
  body: {
    row: EditableRow,
    cell: EditableCell,
  },
};

const EditableTable = ({ dataSource, columns, handleSave }) => {
  const [form] = Form.useForm();

  return (
    <Table dataSource={dataSource} columns={columns} components={tableComponents} />
  )
}

export default EditableTable;