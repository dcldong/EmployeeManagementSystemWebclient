import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { Button, Form, message } from 'antd';
import * as React from 'react';
import axios from 'axios';
import { handleError } from '../../utils';

type DepartmentItem = {
    id: number,
    code: string,
    name: string,
    description: string
}

interface Props {
    reload: () => Promise<any>,
    record: DepartmentItem,
    action: string
}

const ViewButton: React.FC<Props> = (props) => {
    const [form] = Form.useForm<DepartmentItem>();

    return <ModalForm<DepartmentItem>
        title={props.action == "view" ? "查看部门信息" : "编辑部门信息"}
        width={400}
        trigger={
            <a rel="noopener noreferrer" key="view">
                {props.action == "view" ? "查看" : "编辑"}
            </a>
        }
        form={form}
        autoFocusFirstInput={true}
        modalProps={{ destroyOnClose: true, onCancel: () => { } }}
        submitTimeout={2000}
        submitter={{   //隐藏取消按钮
            resetButtonProps: {
                style: {
                    display: 'none',
                },
            },
        }}

        onFinish={async (values) => {
            if (props.action == "edit") {
                const config = {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                };
                try {
                    await axios.post("/api/v1/department/update", {
                        "id": props.record.id,
                        "code": values.code,
                        "name": values.name,
                        "description": values.description
                    }, config);
                    message.success('提交成功');
                    await props.reload();
                } catch (error: any) {
                    handleError(error);
                    return false;
                }
            }
            return true;
        }}
    >

        <ProFormText
            width="lg"
            name="code"
            label="部门编号"
            initialValue={props.record.code}
            readonly={props.action == "view" && true}
            rules={[{ required: true, message: '请输入部门编号!' }]}
            placeholder="请输入部门编号" />
        <ProFormText
            width="lg"
            name="name"
            label="部门名称"
            initialValue={props.record.name}
            rules={[{ required: true, message: '请输入部门名称!' }]}
            readonly={props.action == "view" && true}
            placeholder="请输入部门名称" />
        <ProFormText
            width="lg"
            name="description"
            label="部门描述"
            initialValue={props.record.description}
            readonly={props.action == "view" && true}
            placeholder="请输入部门描述" />
    </ModalForm>
}

export default ViewButton;