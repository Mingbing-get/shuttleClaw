import { Select, SelectProps } from 'antd'
import { useAllModels } from '../../hooks'

export default function ModelPicker(
  props: Omit<SelectProps, 'options' | 'loading'>,
) {
  const [modelList, loading] = useAllModels()

  return (
    <Select
      {...props}
      options={modelList.map((model) => ({
        label: model.model,
        value: model.id,
      }))}
      loading={loading}
    />
  )
}
