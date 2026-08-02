output "node_role_arn" {
  description = "ARN of the Karpenter node IAM role"
  value       = aws_iam_role.karpenter_node_role.arn
}

output "node_role_name" {
  description = "Name of the Karpenter node IAM role"
  value       = aws_iam_role.karpenter_node_role.name
}

output "node_instance_profile_name" {
  description = "Name of the instance profile Karpenter attaches to launched nodes"
  value       = aws_iam_instance_profile.karpenter_node_instance_profile.name
}

output "controller_role_arn" {
  description = "ARN of the Karpenter controller IRSA role - annotate the karpenter service account with this"
  value       = aws_iam_role.karpenter_controller_role.arn
}