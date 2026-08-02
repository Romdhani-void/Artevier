output "external_secrets_role_arn" {
  description = "IAM role ARN for External Secrets Operator (annotate ESO service account)"
  value       = module.eks.external_secrets_role_arn
}

output "aws_load_balancer_controller_role_arn" {
  description = "IAM role ARN for AWS Load Balancer Controller"
  value       = module.eks.aws_load_balancer_controller_role_arn
}

output "vpc_id" {
  value = module.network.vpc_id
}

output "cluster_endpoint" {
  value = module.eks.cluster_endpoint
}

output "karpenter_controller_role_arn" {
  value = module.karpenter.controller_role_arn
}

output "karpenter_node_instance_profile_name" {
  value = module.karpenter.node_instance_profile_name
}