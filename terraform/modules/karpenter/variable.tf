variable "cluster_name" {
  description = "The name of the EKS cluster"
  type        = string
}

variable "oidc_provider_arn" {
  description = "ARN of the EKS cluster's OIDC provider"
  type        = string
}

variable "oidc_provider_url" {
  description = "URL of the EKS cluster's OIDC provider issuer"
  type        = string
}