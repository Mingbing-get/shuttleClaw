import {
  readMemoryFileTool,
  executeSkillScriptTool,
  readSkillReferenceTool,
  memoryDirectoryIndexTool,
  readSkillInstructionTool,
  searchMemoryGloballyTool,
} from '@shuttle-ai/render-react'

export default function initAgent(name: string) {
  return {
    tools: [
      readMemoryFileTool,
      executeSkillScriptTool,
      readSkillReferenceTool,
      memoryDirectoryIndexTool,
      readSkillInstructionTool,
      searchMemoryGloballyTool,
    ],
  }
}
