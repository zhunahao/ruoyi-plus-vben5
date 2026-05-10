<script setup lang="ts">
import { ref } from 'vue';
import type { Recordable } from '@vben/types';
import { cloneDeep } from '@vben/utils';
import { useVbenModal, z } from '@vben/common-ui';
import { useVbenForm } from '#/adapter/form';
import { memberApi } from '../api/member-info';

const emit = defineEmits<{ reload: [] }>();

const adjustType = ref<'add' | 'reduce'>('add');

const [BasicForm, formApi] = useVbenForm({
  commonConfig: {
    formItemClass: 'col-span-2',
    labelWidth: 100,
    componentProps: {
      class: 'w-full',
    },
  },
  schema: [
    {
      fieldName: 'userId',
      label: '用户ID',
      component: 'Input',
      dependencies: {
        show: () => false,
        triggerFields: [''],
      },
    },
    {
      fieldName: 'productId',
      label: '商品ID',
      component: 'Input',
      dependencies: {
        show: () => false,
        triggerFields: [''],
      },
    },
    {
      fieldName: 'productName',
      label: '商品名称',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'currentStock',
      label: '当前库存',
      component: 'InputNumber',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'quantity',
      label: '调整数量',
      component: 'InputNumber',
      componentProps: {
        min: 1,
        step: 1,
        precision: 0,
        placeholder: '请输入调整数量',
      },
      rules: z.number().gt(0, '请输入大于0的调整数量'),
    },
    {
      fieldName: 'remark',
      label: '备注',
      component: 'Textarea',
      componentProps: {
        rows: 3,
        placeholder: '可选，填写调整原因',
      },
      rules: z.string().optional(),
    },
  ],
  showDefaultActions: false,
  wrapperClass: 'grid-cols-2',
});

const [BasicModal, modalApi] = useVbenModal({
  fullscreenButton: false,
  onCancel: handleCancel,
  onConfirm: handleConfirm,
  onOpenChange: async (isOpen) => {
    if (!isOpen) {
      return null;
    }
    modalApi.modalLoading(true);

    const data = modalApi.getData() as {
      userId?: string;
      product?: Recordable<number>;
      type?: 'add' | 'reduce';
    };

    console.log('modal data', data);
    adjustType.value = data.type || 'add';

    await formApi.setValues({
      userId: data.userId ?? '',
      productId: data.product?.productId ?? '',
      productName: data.product?.productName ?? '',
      currentStock: data.product?.userInventory ?? 0,
      quantity: 10,
      remark: '',
    });

    modalApi.modalLoading(false);
  },
});

async function handleConfirm() {
  try {
    modalApi.modalLoading(true);
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }
    const values = cloneDeep(await formApi.getValues()) as {
      userId?: string;
      productId?: string;
      productName?: string;
      quantity?: number;
      remark?: string;
    };

    if (!values.userId || !values.productId || !values.quantity) {
      return;
    }

    if (adjustType.value === 'add') {
      await memberApi.addInventory({
        userId: values.userId,
        remark: values.remark,
        items: [
          {
            productId: values.productId,
            productName: values.productName,
            quantity: values.quantity,
          },
        ],
      });
    } else {
      await memberApi.reduceInventory({
        userId: values.userId,
        items: [
          {
            productId: values.productId,
            productName: values.productName,
            quantity: values.quantity,
          },
        ],
        remark: values.remark,
      });
    }

    emit('reload');
    await handleCancel();
    window.message.success(adjustType.value === 'add' ? '增加库存成功' : '减少库存成功');
  } catch (error) {
    console.error(error);
  } finally {
    modalApi.modalLoading(false);
  }
}

async function handleCancel() {
  modalApi.close();
  await formApi.resetForm();
}
</script>

<template>
  <BasicModal :close-on-click-modal="false" :title="adjustType === 'add' ? '增加库存' : '减少库存'" class="w-[600px]">
    <BasicForm />
  </BasicModal>
</template>
