import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import * as React from 'react';
import DetailLayout from '../../layout/DetailLayout';
import CreateButton from './CreateButton';
import ViewButton from './ViewButton';
import axios from 'axios';
import { handleError } from '../../utils';

interface Props {
}
const DepartmentPage: React.FC<Props> = (props) => {
    const actionRef = React.useRef<ActionType>();

    type DepartmentItem = {
        id: number,
        code: string,
        name: string,
        description: string
    }

    const columns: ProColumns<DepartmentItem>[] = [
        {
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48
        },
        {
            title: '部门编号',
            dataIndex: 'code',
            hideInSearch: true
        },
        {
            title: '部门名称',
            dataIndex: 'name',
            hideInSearch: true
        },
        {
            title: '部门描述',
            dataIndex: 'description',
            hideInSearch: true
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
                    try {
                        await axios.post("/api/v1/departments/delete", { "ids": [record.id] }, config);
                        action?.reload();
                    } catch (error: any) {
                        handleError(error);
                    }

                }}>删除</a>
            ]
        }
    ]

    return <DetailLayout>
        <ProTable<DepartmentItem>
            columns={columns}
            actionRef={actionRef}
            cardBordered
            editable={{
                type: 'multiple',
            }}
            request={async (params = {}, sort, filter) => {
                const config = {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                };
                const result = await axios.get("/api/v1/departments", config);
                return Promise.resolve(result.data);
            }}
            rowKey="id"
            search={false}
            options={{ setting: { listsHeight: 400 } }}
            pagination={false}
            headerTitle="部门管理"
            toolBarRender={() => [
                <CreateButton reload={actionRef.current!.reload} />
            ]}
        // toolBarRender={() => [<span>1</span>]}
        />
    </DetailLayout>;
}

export default DepartmentPage;