import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { Form, message } from 'antd';
import * as React from 'react';
import axios from 'axios';
import md5 from 'js-md5';
import { handleError } from '../../utils';

type AdminItem = {
    id: number,
    userName: string,
    password: string,
    remark: string
}

interface Props {
    reload: () => Promise<any>,
    record: AdminItem,
    action: string
}

const ViewButton: React.FC<Props> = (props) => {
    const [form] = Form.useForm<AdminItem>();

    return <ModalForm<AdminItem>
        title={props.action == "editUserName" ? "修改管理员信息" : "重置密码"}
        width={400}
        trigger={
            <a rel="noopener noreferrer" key="view">
                {props.action == "editUserName" ? "修改" : "重置密码"}
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
            console.log(props.action)
            if (props.action == "editUserName") {
                const config = {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                };
                try {
                    await axios.post("/api/v1/user/update", {
                        "id": props.record.id,
                        "userName": values.userName,
                        "remark": values.remark
                    }, config);
                    message.success('提交成功');
                    await props.reload();
                } catch (error: any) {
                    handleError(error);
                    return false;
                }

            } else {
                const config = {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                };
                await axios.post("/api/v1/user/resetPassword", {
                    "id": props.record.id,
                    "password": md5(values.password)
                }, config);
                message.success('提交成功');
                await props.reload();
            }
            return true;
        }}
    >

        <ProFormText
            width="lg"
            name="userName"
            label="用户名"
            initialValue={props.record.userName}
            required={true}
            readonly={props.action == "resetPassword" && true}
            hidden={props.action == "resetPassword" && true}
            rules={[{ required: true, message: '请输入用户名!' }]}
            placeholder="请输入用户名" />
        <ProFormText
            width="lg"
            name="remark"
            label="备注信息"
            initialValue={props.record.remark}
            readonly={props.action == "resetPassword" && true}
            hidden={props.action == "resetPassword" && true}
            placeholder="请输入备注信息" />
        <ProFormText.Password
            width="lg"
            name="password"
            label="密码"
            initialValue=''
            readonly={props.action == "editUserName" && true}
            hidden={props.action == "editUserName" && true}
            rules={[{ required: props.action == "resetPassword" && true, message: '请输入密码!' }]}
            placeholder="请输入新密码" />
    </ModalForm>
}

export default ViewButton;