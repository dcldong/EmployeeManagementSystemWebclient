import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import * as React from 'react';
import DetailLayout from '../../layout/DetailLayout';
import CreateButton from './CreateButton';
import axios from 'axios';
import ViewButton from './ViewButton';
import { handleError } from '../../utils';


interface Props {
}
const EmployeePage: React.FC<Props> = (props) => {

    const actionRef = React.useRef<ActionType>();

    type EmployeeItem = {
        id: number,
        code: string,
        name: string,
        sex: string,
        departmentId: number,
        departmentName: string,
        position: string,
        entryTime: string,
        phoneNumber: string,
        idNumber: string,
        birthday: string,
        address: string,
        remark: string
    }

    type params = { pageSize: number, current: number }

    const columns: ProColumns<EmployeeItem>[] = [
        {
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
        },
        {
            title: '员工编号',
            dataIndex: 'code',
        },
        {
            title: '员工姓名',
            dataIndex: 'name',
        },
        {
            title: '员工性别',
            dataIndex: 'sex',
            hideInSearch: true,
        },
        {
            title: '所属部门',
            dataIndex: 'departmentName',
            hideInSearch: true,
        },
        {
            title: '职位',
            dataIndex: 'position',
            hideInSearch: true,
        },
        {
            title: '入职时间',
            dataIndex: 'entryTime',
            valueType: 'date',
            hideInSearch: true,
        },
        {
            title: '手机号',
            dataIndex: 'phoneNumber',
            hideInSearch: true,
        },
        {
            title: '操作',
            valueType: 'option',
            key: 'option',
            render: (text, record, _, action) => [
                <ViewButton record={record} action="view" reload={actionRef.current!.reload} />,
                <ViewButton record={record} action="edit" reload={actionRef.current!.reload} />,
                <a key="delete" onClick={async () => {
                    const config = {
                        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                    };
                    await axios.post("/api/v1/employees/delete", { "ids": [record.id] }, config);
                    action?.reload();
                }}>删除</a>
            ]
        }
    ]

    return <DetailLayout>
        <ProTable<EmployeeItem, params>
            columns={columns}
            actionRef={actionRef}
            cardBordered
            request={async (params, sort, filter) => {
                const config = {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                };
                try {
                    const totalNumberResult = await axios.post("/api/v1/employees/totalNumber", params, config);
                    const result = await axios.post("/api/v1/employees", params, config);
                    // return Promise.resolve(result.data);
                    return {
                        data: result.data.data,
                        // success 请返回 true，
                        // 不然 table 会停止解析数据，即使有数据
                        success: true,
                        // 不传会使用 data 的长度，如果是分页一定要传
                        total: totalNumberResult.data.data.totalNumber,
                    };
                } catch (error: any) {
                    handleError(error);
                    throw error;
                }

            }}
            rowKey="id"
            search={{ labelWidth: 'auto' }}
            options={{ setting: { listsHeight: 400 } }}
            pagination={{
                pageSize: 15,
                onChange: (page) => { },
            }}
            headerTitle="用户管理"
            toolBarRender={() => [
                <CreateButton reload={actionRef.current!.reload} />
            ]}
        // toolBarRender={() => [<span>1</span>]}
        />
    </DetailLayout>;
}

export default EmployeePage;