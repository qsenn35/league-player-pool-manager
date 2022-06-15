import { EditableCell, EditableRow } from '../../components';
import { Table } from 'antd';


const tableComponents = {
  body: {
    row: EditableRow,
    cell: EditableCell,
  },
};

const EditableTable = ({ dataSource, columns, handleSave, ...rest }) => {
  return (
    <Table dataSource={dataSource} columns={columns} components={tableComponents} {...rest} />
  )
}

export default EditableTable;